/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import Forth from './forth'
import fs from 'fs'

class Ide {
    public forth: Forth;
    public constructor(f: Forth) {
        this.forth = f
    }

    private writeMessage(output: string, message: string): void {
        if (output.trim() !== "") {
            const outNode = document.getElementById("output") as HTMLTextAreaElement
            if (outNode) {
                outNode.value += `${output.trim()}\n`
                outNode.scrollTop = outNode.scrollHeight
            }

            const msgNode = document.getElementById("message") as HTMLTextAreaElement
            if (msgNode) {
                msgNode.value += `${message.trim()}\n`
                msgNode.scrollTop = msgNode.scrollHeight
            }
        }
    }

    public clearMessages(): void {
        const out = document.getElementById("output") as HTMLTextAreaElement
        out.value = ""

        const msg = document.getElementById("message") as HTMLTextAreaElement
        msg.value = ""
    }

    private showStack(): void {
        const stackStr = this.forth.stack.getStack().reverse().join('\n')
        const stackNode = document.getElementById("stack") as HTMLTextAreaElement
        if (stackNode) {
            stackNode.value = stackStr
        }
    }

    public onForthOutput(error: string, output: string): void {
        if (error) {
            this.writeMessage('_', error)
        } else {
            this.writeMessage(output, 'ok')
        }
        if (this.showStack) {
            this.showStack();
        }
    }

    public runforth(): void {
        let inputNode = document.getElementById("input") as HTMLTextAreaElement
        let input = inputNode.value.trim();
        if (input) {
            const xs = input.split('\n')
            xs.forEach((element: string): void => {
                this.forth.run(`${element}\n`)
            });
        }
    }

    public loadForth(file: string): void {
        try {
            let src = fs.readFileSync(file, 'utf8')
            this.forth.run(src)
        } catch (e) {
            const err = `Failed to load and execute forth file ${file}. ${e}`
            throw err
        }
    }
}

export default Ide;
