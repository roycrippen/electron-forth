/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import NumericOperations from './numeric-operations';
import Output from './output';
import Definitions from './Definitions'
import BooleanOperations from './boolean-operations'
import StackOperations from './stack-operations'
import MemoryOperations from './memory-operations'
import ControlStructures from './control-structures'
import JsInterop from './js-interop'
import Input from './input'
import Include from './Include'
import Interpreter from './interpreter'
import Stack from './Stack'
import Ide from './Ide'
import Core from './Core'

class Forth {
    public instructionPointer: number = 0
    public dataSpace: any[] = []
    public returnStack: Stack = new Stack("Return Stack")
    public stack: Stack = new Stack("Stack")
    public _currentInput = null
    private coreLast: [number, number] = [0, 0]

    public run: Function = new Function()
    public _readWord: Function = new Function()

    // from Definitions.ts
    public defheader: Function = new Function()
    public defjs: Function = new Function()
    public defvar: Function = new Function()
    public _latest: Function = new Function()
    public compiling: Function = new Function()
    public compileEnter: Function = new Function()
    public findDefinition: Function = new Function()
    public _lit: Function = new Function()

    public ide: Ide
    public endOfInput = false

    public constructor() {
        new Definitions(this);
        new Core(this)
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
        this.coreLast = [this._latest(), this.dataSpace.length]
    }

    public interpret(event: KeyboardEvent): void {
        const prep = (): void => {
            this.stack.clear()
            this.ide.showStack()
            this.ide.clearMessages()
            this._currentInput = null

            // put core back to original state
            const [pos, end] = this.coreLast
            this._latest(pos)
            this.dataSpace.length = end
        }

        if (event.key === "Enter" && event.ctrlKey) {
            prep()
            this.ide.runforth()
        } else if (event.ctrlKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            prep()
            this.ide.runforth(true)
        }
    }
}

export default Forth