// var Stack = require("./stack.js");
import Stack from './stack';

function Data (f) {
    f.instructionPointer = 0;
    f.dataSpace = [];
    f.returnStack = new Stack("Return Stack");
    f.stack = new Stack("Stack");

    return f;
}

// module.exports = Data;
export default Data;