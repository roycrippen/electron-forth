/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "./Header";

class Definitions {
    public constructor(f: any) {

        // Temporary definition until latest is defined as a variable
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let latest = function latest(_n: any = 0): any | null {
            return null
        };

        f.defheader = (name: string, immediate: boolean = false, hidden: boolean = false): void => {
            f.dataSpace.push(new Header(latest(), name, immediate, hidden, f.dataSpace.length + 1));
            latest(f.dataSpace.length - 1);
        }

        f.defjs = (name: string, fn: Function, immediate?: boolean, displayName?: string): Function => {
            f.defheader(displayName || name, immediate);
            f.dataSpace.push(fn);
            return fn;
        }

        f.defvar = (name: string, initial: any): any => {
            f.defheader(name);
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
            }
        }

        latest = f.defvar("latest", f.dataSpace.length)

        f.compiling = f.defvar("state", 0)

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
        }

        f.findDefinition = (word: string): any => {
            let current = f._latest();
            while (current !== null) {
                let wordDefinition = f.dataSpace[current];
                // Case insensitive
                if (wordDefinition.name && wordDefinition.name.toLowerCase() == word.toLowerCase() && !wordDefinition.hidden)
                    return wordDefinition;
                current = wordDefinition.link;
            }
            return current;
        }

        f._lit = f.defjs("lit", function lit(): void {
            f.stack.push(f.dataSpace[f.instructionPointer]);
            f.instructionPointer++;
        })

        f._latest = latest;

    }
}

export default Definitions;
