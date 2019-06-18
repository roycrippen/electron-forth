/* eslint-disable @typescript-eslint/no-var-requires */

import NumericOperations from './numeric-operations';
import Output from './output';
import Definitions from './definitions'
import BooleanOperations from './boolean-operations'
import StackOperations from './stack-operations'
import MemoryOperations from './memory-operations'
import ControlStructures from './control-structures'
import JsInterop from './js-interop'
import Input from './input'
import Include from './include'
import Interpreter from './interpreter'
import Stack from './stack';

class Forth {
    public instructionPointer: number = 0;
    public dataSpace: [] = [];
    public returnStack: Stack = new Stack("Return Stack");
    public stack: Stack = new Stack("Stack");

    public constructor() {
        // this will let us use end around dictionary and 
        // have properties persist because returning 
        let forth = Object.assign({}, this);

        new Definitions(forth);
        new Input(forth);
        new NumericOperations(forth);
        new BooleanOperations(forth);
        new StackOperations(forth);
        new MemoryOperations(forth);
        new ControlStructures(forth);
        new Output(forth);
        new JsInterop(forth);
        new Include(forth);
        new Interpreter(forth);

        return forth;
    }
}

export default Forth