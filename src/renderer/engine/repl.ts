import Forth from './forth'

class Repl {
    public forth: Forth;
    public constructor(f: Forth) {
        this.forth = f
        f.ide.loadForth("forth/forth.fth")
    }

    public interpret(event: KeyboardEvent): void {
        if (event.key === "Enter" && event.ctrlKey) {
            this.forth.stack.clear()
            this.forth.ide.clearMessages()
            this.forth._currentInput = null
            this.forth.ide.runforth()
        }
    }
}

export default Repl;
