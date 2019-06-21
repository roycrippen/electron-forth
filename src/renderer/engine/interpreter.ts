/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

// var InputExceptions = require("./input-exceptions.js");
import InputExceptions from './input-exceptions'

class Interpreter {
    public constructor(f: any) {

        // function runInterpreter(): void {
        //     // Run while there is still input to consume 
        //     while (f._currentInput) {
        //         try {
        //             // As js doesn't support tail call optimisation the
        //             // run function uses a trampoline to execute forth code
        //             // eslint-disable-next-line no-constant-condition
        //             while (true) {
        //                 f.currentInstruction();
        //                 f.currentInstruction = f.dataSpace[f.instructionPointer++];
        //             }
        //         } catch (err) {
        //             if (err === InputExceptions.EndOfInput) {
        //                 f._popInput();
        //             } else {
        //                 throw err;
        //             }
        //         }
        //     }
        // }

        function runInterpreter(): void {
            // Run while there is still input to consume 
            while (f._currentInput) {
                try {
                    // As js doesn't support tail call optimisation the
                    // run function uses a trampoline to execute forth code
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        f.currentInstruction();
                        f.currentInstruction = f.dataSpace[f.instructionPointer++];
                    }
                } catch (err) {
                    if (err === InputExceptions.EndOfInput) {
                        f._popInput();
                    } else {
                        throw err;
                    }
                }
            }
        }

        function printStackTrace(): string {
            let stackTrace = "    " + f.currentInstruction.name + " @ " + (f.instructionPointer - 1);
            for (let i = f.returnStack.length - 1; i >= 0; i--) {
                let instruction = f.returnStack[i];
                stackTrace += "\n    " + f.dataSpace[instruction - 1].name + " @ " + (instruction - 1);
            }
            return stackTrace;
        }

        function interpretWord(): void {
            let word = f._readWord();
            while (!word) {
                if (!f._currentInput.refill()) throw InputExceptions.EndOfInput;
                word = f._readWord();
            }

            let definition = f.findDefinition(word);
            if (definition) {
                if (!f.compiling() || definition.immediate) {
                    f.dataSpace[definition.executionToken]();
                    return;
                } else {
                    f.dataSpace.push(f.dataSpace[definition.executionToken]);
                }
            } else {
                let num = f._parseFloatInBase(word);
                if (isNaN(num)) throw "Word not defined: " + word;
                if (f.compiling()) {
                    f.dataSpace.push(f._lit);
                    f.dataSpace.push(num);
                } else {
                    f.stack.push(num);
                }
            }
        }

        let interpretInstruction = f.dataSpace.length + 1;

        f.defjs("interpret", function interpret(): void {
            f.instructionPointer = interpretInstruction; // Loop after interpret word is called
            interpretWord();
        });

        f._evaluate = f.defjs("evaluate", function evaluate(): void {
            let length = f.stack.pop();
            let address = f.stack.pop();
            if (address < 0) {
                let position = address - f._INPUT_SOURCE;
                f._subInput(position, length);
            } else {
                let string = "";
                for (let i = 0; i < length; i++) {
                    string += String.fromCharCode(f._getAddress(address + i));
                }
                f._newInput(string, -1);
            }

            f.instructionPointer = interpretInstruction;
        });

        let quit = f.defjs("quit", function quit(): void {
            f.compiling(false); // Enter interpretation state
            f.returnStack.clear(); // Clear return stack
            f.instructionPointer = interpretInstruction; // Run the interpreter
        });

        let abort = f.defjs("abort", function abort(error: any): void {
            f.stack.clear();
            throw error || "";
        });

        function run(input: string, sourceId: number): void {

            f._newInput(input, sourceId || 0);
            f._output = "";

            try {
                runInterpreter();
            } catch (err) {
                if (err !== InputExceptions.WaitingOnInput) {
                    console.error("Exception " + err + " at:\n" + printStackTrace());
                    console.error(f._currentInput.inputBuffer());
                    console.error(f._output);
                    f.currentInstruction = quit;
                    f.stack.clear();
                    f.onForthOutput(err, f._output);
                    throw err;
                }
            }

            f.onForthOutput(null, f._output);
        }

        // function run(input: string, outputCallback: Function, sourceId: number): void {
        //     f.outputCallback = outputCallback;

        //     f._newInput(input, sourceId || 0);
        //     f._output = "";

        //     try {
        //         runInterpreter();
        //     } catch (err) {
        //         if (err !== InputExceptions.WaitingOnInput) {
        //             console.error("Exception " + err + " at:\n" + printStackTrace());
        //             console.error(f._currentInput.inputBuffer());
        //             console.error(f._output);
        //             f.currentInstruction = quit;
        //             f.stack.clear();
        //             outputCallback(err, f._output);
        //             throw err;
        //         }
        //     }

        //     outputCallback(null, f._output);
        // }

        f.defjs('abort"', function abortQuote(): void {
            let error = f._currentInput.parse('"'.charCodeAt(0))[2];
            f.dataSpace.push(function abortQuote(): void {
                if (f.stack.pop())
                    abort(error);
            });
        }, true); // Immediate

        f.defjs("execute", function execute(): void {
            f.dataSpace[f.stack.pop()]();
        });

        // Set initial instruction
        f.currentInstruction = quit;
        f.run = run;
    }
}
export default Interpreter;