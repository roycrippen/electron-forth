
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

interface Fatal {
    error: boolean,
    msg: string
}

class Gforth {
    public p: ChildProcessWithoutNullStreams
    public fatal: Fatal = { error: false, msg: '' }
    private inputLines = 0
    private stack: string[] = []
    private inputNode: HTMLTextAreaElement
    private pointerNode: HTMLTextAreaElement
    private lineNumNode: HTMLTextAreaElement
    private pointerSymbol = '\u2B95'  //'\u25BA'

    public constructor() {
        // temp valid values
        this.inputNode = document.createElement("textarea");
        this.pointerNode = document.createElement("textarea");
        this.lineNumNode = document.createElement("textarea");

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

    private movePointer(lineNum: number): void {
        // todo: make line-num, pointer and input a single testarea
        const l = Math.max(Math.min(lineNum, this.inputLines), 1)
        const s = '\n'.repeat(l - 1) + this.pointerSymbol
        this.pointerNode.value = s
    }

    private getLine(): number {
        let node = this.pointerNode
        if (node) {
            const num = node.value.split("\n").length
            return num
        }
        return 1
    }

    private selectLine(line: number): void {
        let node = this.lineNumNode
        if (node) {
            this.movePointer(line)
            this.inputNode.focus()
        }
    }

    private setLine(): void {
        let input = this.inputNode.value.trim() + '\n';
        if (input) {
            let xs = input.split('\n')
            this.inputLines = xs.length
        }
    }

    public initLines(): void {
        this.inputNode = document.getElementById('input') as HTMLTextAreaElement
        this.inputNode.addEventListener('scroll', () => this.inputScroll())
        this.inputNode.addEventListener('keydown', (e) => this.interpret(e))

        this.lineNumNode = document.getElementById("line-num") as HTMLTextAreaElement
        this.lineNumNode.addEventListener('click', (e) => this.runToClickedLine(e))

        this.pointerNode = document.getElementById("pointer") as HTMLTextAreaElement

        this.setLine()
        this.addLineNumbers()
        this.inputNode.focus()
    }

    private addLineNumbers(): void {
        let str = ''
        for (let i = 1; i < this.inputLines + 1; i++) {
            const nStr = this.leftFillNum(i, 4)
            str += `${nStr}\n`
        }
        if (this.lineNumNode) {
            this.lineNumNode.value = str
            this.selectLine(1)
        }
    }

    public runToClickedLine(_e: MouseEvent): void {
        const line = Math.floor(this.lineNumNode.selectionStart / 4)
        this.movePointer(line)
        this.stack = []
        this.clearMessages()
        this.run(this.getCommands(line + 1))
    }

    public inputChanged(): void {
        this.setLine()
        let lineNode = document.getElementById("line-num") as HTMLTextAreaElement
        const last = lineNode.value.trim().slice(-4)
        if (lineNode) {
            if (this.inputLines != parseInt(last))
                this.addLineNumbers()
        }
    }

    public inputScroll(): void {
        this.lineNumNode.scrollTop = this.inputNode.scrollTop
        this.pointerNode.scrollTop = this.inputNode.scrollTop
    }

    public interpret(event: KeyboardEvent): void {
        const prep = (): void => {
            this.stack = []
            this.clearMessages()
        }

        this.inputChanged()

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
            this.selectLine(line)
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