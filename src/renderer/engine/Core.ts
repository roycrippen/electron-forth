/* eslint-disable @typescript-eslint/no-explicit-any */

// import Forth from './forth'

class Core {
    public constructor(f: any) {
        const exit = f.defjs("exit", function exit(): void {
            f.instructionPointer = f.returnStack.pop();
        });

        // add forth functions 
        f.defjs(":", function colon(): void {
            let name = f._readWord();
            f.defheader(name, false, true);
            f.compileEnter(name);
            f.compiling(true);
        });

        f.defjs(":noname", function noname(): void {
            f.defheader("noname", false, true);
            f.stack.push(f.dataSpace.length);
            f.compileEnter("_noname_");
            f.compiling(true);
        });

        f.defjs(";", function semicolon(): void {
            f.dataSpace.push(exit);
            f.dataSpace[f._latest()].hidden = false;
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
            f.defheader(f._readWord());
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
            let wordDefinition = f.dataSpace[f._latest()];
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
            let savedLatest = f._latest();
            let savedLength = f.dataSpace.length;

            f.defheader(f._readWord());
            f.dataSpace.push(function marker(): void {
                f._latest(savedLatest);
                f.dataSpace.length = savedLength;
            });
        });
    }
}

export default Core;