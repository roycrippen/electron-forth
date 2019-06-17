/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "./Header";

class Definitions {
    public constructor(f: any) {

        // Temporary definition until latest is defined as a variable
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let latest = function latest(_n: any = 0): any | null {
            return null
        };

        function defheader(name: string, immediate: boolean = false, hidden: boolean = false): void {
            f.dataSpace.push(new Header(latest(), name, immediate, hidden, f.dataSpace.length + 1));
            latest(f.dataSpace.length - 1);
        }

        f.defjs = function defjs(name: string, fn: Function, immediate: boolean, displayName?: string): Function {
            defheader(displayName || name, immediate);
            f.dataSpace.push(fn);
            return fn;
        };

        f.defvar = function defvar(name: string, initial: any): any {
            defheader(name);
            const varAddress = f.dataSpace.length + 1;
            f.dataSpace.push(function variable(): any {
                f.stack.push(varAddress);
            });
            f.dataSpace.push(initial);

            return function (value: any): any {
                if (value !== undefined)
                    f.dataSpace[varAddress] = value;
                else
                    return f.dataSpace[varAddress];
            };
        };

        latest = f.defvar("latest", f.dataSpace.length); // Replace existing function definition
        f.compiling = f.defvar("state", 0);

        f.compileEnter = function compileEnter(name: string): Function {
            let instruction = f.dataSpace.length + 1;

            let enter;
            try {
                enter = eval(`(
                function ${name}() {
                    f.returnStack.push(f.instructionPointer);
                    f.instructionPointer = instruction;
                })
            `);
            } catch (e) {
                // Failback for names that are invalid identifiers
                enter = function enter(): void {
                    f.returnStack.push(f.instructionPointer);
                    f.instructionPointer = instruction;
                };
            }

            f.dataSpace.push(enter);
            return enter;
        };

        f.findDefinition = function findDefinition(word: string): any {
            let current = latest();
            while (current !== null) {
                let wordDefinition = f.dataSpace[current];
                // Case insensitive
                if (wordDefinition.name && wordDefinition.name.toLowerCase() == word.toLowerCase() && !wordDefinition.hidden)
                    return wordDefinition;
                current = wordDefinition.link;
            }
            return current;
        };

        let _lit = f.defjs("lit", function lit(): void {
            f.stack.push(f.dataSpace[f.instructionPointer]);
            f.instructionPointer++;
        });

        let exit = f.defjs("exit", function exit(): void {
            f.instructionPointer = f.returnStack.pop();
        });


        f._latest = latest;
        f._lit = _lit;

        // add forth functions 
        f.defjs(":", function colon(): void {
            let name = f._readWord();
            defheader(name, false, true);
            f.compileEnter(name);
            f.compiling(true);
        });

        f.defjs(":noname", function noname(): void {
            defheader("noname", false, true);
            f.stack.push(f.dataSpace.length);
            f.compileEnter("_noname_");
            f.compiling(true);
        });

        f.defjs(";", function semicolon(): void {
            f.dataSpace.push(exit);
            f.dataSpace[latest()].hidden = false;
            f.compiling(false);
        }, true); // Immediate

        f.defjs("find", function find(): void {
            let input = f.stack.pop();
            let word = input;
            if (typeof input === "number") {
                let startPosition = input;
                let length = f._getAddress(startPosition);
                word = "";
                for (let i = 1; i <= length; i++) {
                    word += String.fromCharCode(f._getAddress(startPosition + i));
                }
            }
            let definition = f.findDefinition(word);
            if (definition) {
                f.stack.push(definition.executionToken);
                f.stack.push(definition.immediate ? 1 : -1);
            } else {
                f.stack.push(input);
                f.stack.push(0);
            }
        });

        // Converts an execution token into the data field address
        f.defjs(">body", function dataFieldAddress(): void {
            f.stack.push(f.stack.pop() + 1);
        });

        f.defjs("create", function create(): void {
            defheader(f._readWord());
            let dataFieldAddress = f.dataSpace.length + 1;
            f.dataSpace.push(function pushDataFieldAddress(): void {
                f.stack.push(dataFieldAddress);
            });
        });

        f.defjs("allot", function allot(): void {
            f.dataSpace.length += f.stack.pop();
        });

        f.defjs(",", function comma(): void {
            f.dataSpace.push(f.stack.pop());
        });

        f.defjs("compile,", function compileComma(): void {
            f.dataSpace.push(f.dataSpace[f.stack.pop()]);
        });

        f.defjs("[", function lbrac(): void {
            f.compiling(false); // Immediate
        }, true); // Immediate

        f.defjs("]", function rbrac(): void {
            f.compiling(true); // Compile
        });

        f.defjs("immediate", function immediate(): void {
            let wordDefinition = f.dataSpace[latest()];
            wordDefinition.immediate = true;
        });

        f.defjs("hidden", function hidden(): void {
            let wordDefinition = f.dataSpace[f.stack.pop()];
            wordDefinition.hidden = !wordDefinition.hidden;
        });

        f.defjs("'", function tick(): void {
            f.stack.push(f.findDefinition(f._readWord()).executionToken);
        });

        f.defjs("[']", function bracketTick(): void {
            f.dataSpace.push(f._lit);
            f.dataSpace.push(f.findDefinition(f._readWord()).executionToken);
        }, true);

        f.defjs("marker", function marker(): void {
            let savedLatest = latest();
            let savedLength = f.dataSpace.length;

            defheader(f._readWord());
            f.dataSpace.push(function marker(): void {
                latest(savedLatest);
                f.dataSpace.length = savedLength;
            });
        });
    }
}

// module.exports = Definitions;
export default Definitions;