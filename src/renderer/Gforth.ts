
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

class Gforth {
    public p: ChildProcessWithoutNullStreams
    public fatal_error = false
    public fatal_error_msg  = ''

    private stack: string[] = []

    public constructor() {
        const cmd = 'gfortha'
        this.p = spawn(cmd)
        if (this.p.pid == undefined) {
            this.fatal_error_msg = `Could not load ${cmd}\nExiting application.`
            console.error(this.fatal_error_msg)
            this.fatal_error = true
            return
        }

        this.p.stdout.on('data', (data: Uint8Array) => {
            this.processForthOutput(data)
            // console.log('data event: ' + data)
        })

        this.p.stderr.on('data', (data: Uint8Array) => {
            this.showError(data.toString())
            console.log('stderr event: ' + data)
        })

        this.p.on('close', (code) => {
            console.log('child process exited with code ' + code)
        })

        this.p.stdin.write(': show-stack .s ;\n')
        this.p.stdin.write('marker clear-point\n')
    }

    private showStack(xs: string[]): void {
        let stackStr = xs.join('\n')
        const node = document.getElementById("stack") as HTMLTextAreaElement
        if (node) {
            node.value = stackStr
            node.scrollTop = node.scrollHeight
        }
    }

    private appendOutput(s: string): void {
        s = s.trim()
        if (s.length > 0) {
            const node = document.getElementById("output") as HTMLTextAreaElement
            if (node) {
                node.value += `${s}\n`
                node.scrollTop = node.scrollHeight
            }
        }
    }

    private showError(s: string): void {
        s = s.trim()
        if (s.length > 0) {
            const node = document.getElementById("error") as HTMLTextAreaElement
            if (node) {
                node.value += `${s}\n`
            }
        }
    }

    private fillStack(s: string): string[] {
        let xs: string[] = []
        const pos = s.search('>')
        if (pos > -1) {
            xs = s
                .slice(pos + 2)
                .split(' ')
                .filter(line => line.trim() != 'ok' && line.length != 0)
                .reverse()
        }
        return xs
    }

    public interpret(event: KeyboardEvent): void {
        const prep = (): void => {
            this.stack = []
            this.clearMessages()

            // todo find gforth reset command
        }

        if (event.key === "Enter" && event.ctrlKey) {
            prep()
            this.run(this.getCommands())
        } else if (event.ctrlKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            prep()
            this.run(this.getCommands(true))
        }
    }

    public run(s: string): void {
        // clear the forth stack
        this.p.stdin.write('clearstack\n')

        // clear all definitions and reset the marker 
        this.p.stdin.write('clear-point\n')
        this.p.stdin.write('marker clear-point\n')

        this.p.stdin.write(s)
        this.p.stdin.write('show-stack\n')
    }

    private getCommands(cursorPos: boolean = false): string {
        let inputNode = document.getElementById("input") as HTMLTextAreaElement
        let input = inputNode.value.trim() + '\n';
        if (input) {
            if (cursorPos) {
                let xs = input.split('\n')
                let line = xs.length
                let pos = inputNode.selectionStart
                line = input.substr(0, pos).split("\n").length
                xs = xs.slice(0, line - 1)
                input = ''
                xs.forEach((element: string): void => {
                    input += (`${element}\n`)
                });
            }
            return input
        }
        return ""
    }

    private clearMessages(): void {
        const out = document.getElementById("output") as HTMLTextAreaElement
        out.value = ""

        const msg = document.getElementById("error") as HTMLTextAreaElement
        msg.value = ""
    }

    private processForthOutput(dataBytes: Uint8Array): void {
        let data = dataBytes.toString()

        // cleanup output
        const pos = data.search(': show-stack .s ;  ok')
        if (pos > -1) {
            data = 'Forth loaded...\n'
        }
        if (data.startsWith('clearstack  ok')) {
            data = data.slice(15)
        }
        if (data.startsWith('clear-point  ok')) {
            data = data.slice(16)
        }
        if (data.startsWith('marker clear-point  ok')) {
            data = data.slice(23)
        }

        let xs = data.toString().split('\n')
        xs.forEach((element: string) => {
            if (element.slice(0, 11) == 'show-stack ') {
                this.stack = this.fillStack(element)
                this.showStack(this.stack)
            } else {
                this.appendOutput(element)
            }
        });
    }
}

export default Gforth