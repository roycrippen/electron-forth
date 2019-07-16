
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

interface Fatal {
    error: boolean,
    msg: string
}

class Gforth {
    public p: ChildProcessWithoutNullStreams
    public fatal: Fatal = { error: false, msg: '' }
    public fatal_error_msg = ''

    private stack: string[] = []

    public constructor() {
        const cmd = 'gforth'
        this.p = spawn(cmd)
        if (this.p.pid == undefined) {
            this.fatal.msg = `Could not load '${cmd}'\nExiting application.`
            this.fatal.error = true
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

    private leftFillNum(num: number, width: number) {
        return num
            .toString()
            .padStart(width, ' ')
    }

    private selectTextareaLine(tarea: HTMLTextAreaElement, lineNum: number): void {
        let lines = tarea.value.split("\n");
        if (lineNum < 1 || lineNum > lines.length - 1 ) {
            return
        }
        lineNum--;

        let startPos = 0
        for (var x = 0; x < lines.length; x++) {
            if (x == lineNum) {
                break;
            }
            startPos += (lines[x].length + 1);

        }
        let endPos = lines[lineNum].length + startPos;

        // do selection
        if (typeof (tarea.selectionStart) != "undefined") {
            tarea.focus();
            tarea.selectionStart = startPos;
            tarea.selectionEnd = endPos;
        }
    }

    private getLine(): number {
        let node = document.getElementById("pointer") as HTMLTextAreaElement
        if (node) {
            const num = node.value.substr(0, node.selectionStart).split("\n").length
            return num
        }
        return 1
    }

    private setLine(line: number): void {
        let node = document.getElementById("pointer") as HTMLTextAreaElement
        if (node) {
            this.selectTextareaLine(node, line)
        }
    }

    public initEditor(): void {
        let lineNode = document.getElementById("pointer") as HTMLTextAreaElement
        let inputNode = document.getElementById("input") as HTMLTextAreaElement
        let input = inputNode.value.trim() + '\n';
        if (input) {
            let xs = input.split('\n')
            let str = ''
            for (let i = 1; i < xs.length + 1; i++) {
                const nStr = this.leftFillNum(i, 4)
                str += `${nStr}\n`
            }
            if (lineNode) {
                lineNode.value = str
                this.setLine(1)
            }
            inputNode.focus();
        }
    }

    public runToClickedLine(_event: MouseEvent): void {
        let lineNode = document.getElementById("pointer") as HTMLTextAreaElement
        const line = this.getLine()
        this.selectTextareaLine(lineNode, line)
        this.stack = []
        this.clearMessages()
        this.run(this.getCommands(line + 1))
    }

    public interpret(event: KeyboardEvent): void {
        const prep = (): void => {
            this.stack = []
            this.clearMessages()
        }

        let line = 1
        if (event.altKey && (event.key == "Enter" || event.key == "ArrowDown" || event.key == "ArrowUp")) {
            prep()
            switch (event.key) {
                case "Enter":
                    line = 20
                    break
                case "ArrowDown":
                    line = this.getLine() + 1
                    break
                case "ArrowUp":
                    line = this.getLine() - 1
                    break
                default:
                    break
            }
            this.setLine(line)
            this.run(this.getCommands(line + 1))
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

    private getCommands(line: number): string {
        let inputNode = document.getElementById("input") as HTMLTextAreaElement
        let input = inputNode.value.trim() + '\n';
        if (input) {
            let xs = input.split('\n')
            // let line = xs.length
            // let pos = inputNode.selectionStart
            // line = input.substr(0, pos).split("\n").length
            xs = xs.slice(0, line - 1)
            input = ''
            xs.forEach((element: string): void => {
                input += (`${element}\n`)
            });
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