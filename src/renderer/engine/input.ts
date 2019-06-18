/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import InputExceptions from './input-exceptions'

class InputWindow {
    protected inputBufferPosition: number
    protected inputBufferLength: number
    protected input: string
    protected endPosition: number
    protected toIn: Function
    protected sourceId: number

    public constructor(input: string, startPosition: number, endPosition: number, toIn: Function, sourceId: number) {
        this.inputBufferPosition = startPosition
        this.inputBufferLength = -1
        this.input = input
        this.endPosition = endPosition
        this.toIn = toIn
        this.sourceId = sourceId
    }

    public refill(this: InputWindow): boolean {
        this.inputBufferPosition += this.inputBufferLength + 1;

        this.inputBufferLength = this.input.substring(this.inputBufferPosition).search(/\n/);
        if (this.inputBufferLength == -1 || this.inputBufferPosition + this.inputBufferLength > this.endPosition)
            this.inputBufferLength = this.endPosition - this.inputBufferPosition;

        this.toIn(0);
        return this.inputBufferPosition < this.endPosition;
    }

    public readKey(this: InputWindow): string {
        let keyPosition = this.inputBufferPosition + this.toIn();
        if (keyPosition < this.endPosition) {
            this.toIn(this.toIn() + 1);
            return this.input.charAt(keyPosition);
        } else {
            return "";
        }
    }

    public sBackslashQuote(): string {
        let string = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let char = this.readKey();

            if (char === "\"") {
                break;
            } else if (char === "\\") {
                let nextChar = this.readKey();
                switch (nextChar) {
                    case "a":
                        string += String.fromCharCode(7);
                        break;
                    case "b":
                        string += String.fromCharCode(8);
                        break;
                    case "e":
                        string += String.fromCharCode(27);
                        break;
                    case "f":
                        string += String.fromCharCode(12);
                        break;
                    case "l":
                        string += String.fromCharCode(10);
                        break;
                    case "m":
                        string += String.fromCharCode(13) + String.fromCharCode(10);
                        break;
                    case "n":
                        string += String.fromCharCode(10);
                        break;
                    case "q":
                        string += String.fromCharCode(34);
                        break;
                    case "r":
                        string += String.fromCharCode(13);
                        break;
                    case "t":
                        string += String.fromCharCode(9);
                        break;
                    case "v":
                        string += String.fromCharCode(11);
                        break;
                    case "z":
                        string += String.fromCharCode(0);
                        break;
                    case "\"":
                        string += String.fromCharCode(34);
                        break;
                    case "x":
                        string += String.fromCharCode(parseInt(this.readKey() + this.readKey(), 16));
                        break;
                    case "\\":
                        string += String.fromCharCode(92);
                        break;
                    default:
                        // Be lenient
                        string += nextChar;
                }
            } else {
                string += char;
            }
        }

        return string;
    }

    public source(this: InputWindow): [number, number] {
        return [this.inputBufferPosition, this.inputBufferLength];
    }

    public inputBuffer(this: InputWindow): string {
        if (this.inputBufferLength > 0)
            return this.input.substring(this.inputBufferPosition, this.inputBufferPosition + this.inputBufferLength);
        else
            return "";
    }

    public subInput(position: number, length: number): InputWindow {
        return new InputWindow(this.input, position, position + length, this.toIn, -1);
    }

    public charCodeAt(index: number): number {
        return this.input.charCodeAt(index);
    }

    public parse(this: InputWindow, delimiter: number, skipLeading: boolean): [number, number, string] {
        delimiter = delimiter || " ".charCodeAt(0);
        let inputBuf = this.inputBuffer();

        let startPosition = this.toIn();
        if (skipLeading) {
            while (inputBuf.charCodeAt(startPosition) === delimiter && startPosition < inputBuf.length) {
                startPosition++;
            }
        }

        let endPosition = startPosition;
        while (inputBuf.charCodeAt(endPosition) !== delimiter && endPosition < inputBuf.length) {
            endPosition++;
        }

        this.toIn(endPosition + 1);
        let result = inputBuf.substring(startPosition, endPosition);
        return [this.inputBufferPosition + startPosition, result.length, result];
    }

    public readWord(delimiter: number): string {
        return this.parse(delimiter, true)[2];
    }
}

function Input(f: any): any {
    f._base = f.defvar("base", 10);

    // Input buffer pointer
    let toIn = f.defvar(">in", 0);

    // Address offset to indicate input addresses
    let INPUT_SOURCE = 1 << 31;

    f.defjs("source", function source(): void {
        let positionLength = f._currentInput.source();
        f.stack.push(INPUT_SOURCE + positionLength[0]);
        f.stack.push(positionLength[1]);
    });

    f.defjs("source-id", function sourceId(): void {
        f.stack.push(f._currentInput.sourceId);
    });

    f.defjs("refill", function refill(): void {
        f.stack.push(f._currentInput.refill());
    });

    f.defjs("key", function key(): void {
        f.stack.push(f._currentInput.readKey().charCodeAt(0));
    });

    f.defjs("parse", function parse(): void {
        let addressLength = f._currentInput.parse(f.stack.pop(), false);
        f.stack.push(INPUT_SOURCE + addressLength[0]);
        f.stack.push(addressLength[1]);
    });

    f.defjs("parse-name", function parse(): void {
        let addressLength = f._currentInput.parse(" ".charCodeAt(0), true);
        f.stack.push(INPUT_SOURCE + addressLength[0]);
        f.stack.push(addressLength[1]);
    });

    function readWord(delimiter: number): string {
        return f._currentInput.readWord(delimiter);
    }

    let wordBufferStart = f.dataSpace.length;
    f.dataSpace.length += 128;

    f.defjs("word", function word(): void {
        let delimiter = f.stack.pop();
        let word = readWord(delimiter);
        let length = Math.min(word.length, 127);
        f.dataSpace[wordBufferStart] = length;
        for (let i = 0; i < length; i++) {
            f.dataSpace[wordBufferStart + i + 1] = word.charCodeAt(i);
        }

        f.stack.push(wordBufferStart);
    });

    f.defjs("s\\\"", function sBackslashQuote(): void {
        let string = f._currentInput.sBackslashQuote();
        let stringAddress = f.dataSpace.length + 1;
        f.dataSpace.push(function (): void {
            f.stack.push(stringAddress);
            f.stack.push(string.length);

            // Jump over compiled string
            f.instructionPointer += string.length;
        });

        for (let i = 0; i < string.length; i++) {
            f.dataSpace.push(string[i]);
        }
    }, true); // Immediate

    f.defjs("char", function char(): void {
        f.stack.push(readWord(" ".charCodeAt(0)).charCodeAt(0));
    });

    f.defjs("accept", function accept(): void {

        let maxLength = f.stack.pop();
        let address = f.stack.pop();

        f.currentInstruction = function acceptCallback(): void {
            f._currentInput.refill();
            let received = f._currentInput.inputBuffer().substring(0, maxLength).split("\n")[0];

            f.stack.push(received.length);
            for (let i = 0; i < received.length; i++) {
                f._setAddress(address + i, received[i]);
            }

            popInput();
        };

        throw InputExceptions.WaitingOnInput;
    });

    // returns NaN if any characters are invalid in base
    function parseIntStrict(num: string, base: number): number {
        let int = 0;
        if (num[0] !== "-") { // Positive
            for (let i = 0; i < num.length; i++) {
                int *= base;
                int += parseInt(num[i], base);
            }
            return int;
        } else {
            for (let j = 1; j < num.length; j++) {
                int *= base;
                int -= parseInt(num[j], base);
            }
            return int;
        }
    }

    // Parse a float in the current base
    function _parseFloatInBase(string: string): number {
        let base;
        if (string[0] === "'" && string.length === 3 && string[2] == "'") { // 'a'
            return string.charCodeAt(1);
        } else if (string[0] === "#") { // decimal - #1234567890
            string = string.substring(1);
            base = 10;
        } else if (string[0] === "$") { // hex - $ff00ff
            string = string.substring(1);
            base = 16;
        } else if (string[0] === "%") { // binary - %10110110
            string = string.substring(1);
            base = 2;
        } else {
            base = f._base();
        }

        let num = string.split(/\./);

        let integerPart = 0;
        if (num[0] !== '') {
            integerPart = parseIntStrict(num[0], base);
        }

        let fractionalPart = 0;
        if (num.length > 1 && num[1] !== '') {
            fractionalPart = parseIntStrict(num[1], base) * Math.pow(base, -num[1].length);
        }

        if (integerPart >= 0) {
            return integerPart + fractionalPart;
        } else {
            return integerPart - fractionalPart;
        }
    }

    let inputString = "";

    function newInput(input: string, sourceId: any): void {
        saveCurrentInput();
        let startPosition = inputString.length;
        inputString += input;
        f._currentInput = new InputWindow(inputString, startPosition, inputString.length, toIn, sourceId);
    }

    let inputStack: any[] = [];

    function subInput(position: number, length: number): void {
        saveCurrentInput();
        f._currentInput = f._currentInput.subInput(position, length);
    }

    function saveCurrentInput(): void {
        if (f._currentInput) {
            inputStack.push({
                input: f._currentInput,
                toIn: toIn(),
                instructionPointer: f.instructionPointer
            });
        }
    }

    function popInput(): void {
        let savedInput = inputStack.pop();
        if (savedInput) {
            f._currentInput = savedInput.input;
            toIn(savedInput.toIn);
            f.instructionPointer = savedInput.instructionPointer;
            f.currentInstruction = f.dataSpace[f.instructionPointer++];
        } else {
            f._currentInput = null;
        }
    }

    f.defjs("save-input", function saveInput(): void {
        saveCurrentInput();
        for (let i = 0; i < inputStack.length; i++) {
            f.stack.push(inputStack[i]);
        }
        f.stack.push(inputStack.length);
        inputStack.pop();
    });

    f.defjs("restore-input", function restoreInput(): void {
        inputStack.length = 0;

        let length = f.stack.pop();
        for (let i = length - 1; i >= 0; i--) {
            inputStack[i] = f.stack.pop();
        }

        let savedInput = inputStack.pop();
        f._currentInput = savedInput.input;
        toIn(savedInput.toIn);

        f.stack.push(0);
    });

    f._readWord = readWord;
    f._newInput = newInput;
    f._subInput = subInput;
    f._popInput = popInput;
    f._parseFloatInBase = _parseFloatInBase;
    f._INPUT_SOURCE = INPUT_SOURCE;
}

export default Input;