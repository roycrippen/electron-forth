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
import Include from './Include'
import Interpreter from './interpreter'
import Stack from './stack'
import Ide from './Ide'

class Forth {
    public instructionPointer: number = 0
    public dataSpace: [] = []
    public returnStack: Stack = new Stack("Return Stack")
    public stack: Stack = new Stack("Stack")
    public _currentInput = null

    public run: Function = new Function()
    public defjs: Function = new Function()
    public _readWord: Function = new Function()

    public ide: Ide
    public endOfInput = false

    public constructor() {
        new Definitions(this);
        new Input(this);
        new NumericOperations(this);
        new BooleanOperations(this);
        new StackOperations(this);
        new MemoryOperations(this);
        new ControlStructures(this);
        new Output(this);
        new JsInterop(this);
        new Include(this);
        new Interpreter(this);
        this.ide = new Ide(this)
        this.ide.loadForth("forth/forth.fth")
    }

    public interpret(event: KeyboardEvent): void {
        if (event.key === "Enter" && event.ctrlKey) {
            this.stack.clear()
            this.ide.clearMessages()
            this._currentInput = null
            this.ide.runforth()
        }
    }
}

export default Forth