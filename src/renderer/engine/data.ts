/* eslint-disable @typescript-eslint/no-explicit-any */
import Stack from './stack';

class Data {
    public constructor(f: any) {
        f.instructionPointer = 0;
        f.dataSpace = [];
        f.returnStack = new Stack("Return Stack");
        f.stack = new Stack("Stack");

        return f;
    }
}

// module.exports = Data;
export default Data;