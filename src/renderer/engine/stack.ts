/* eslint-disable @typescript-eslint/no-explicit-any */
class Stack {
    public constructor(name: string) {
        this.stackName = name
    }

    private stackName: string
    private data: any = []

    public pop(): void {
        if (this.data.length > 0)
            return this.data.pop()
        else {
            throw "Stack empty: " + this.stackName
        }
    }
    public push(element: any): void {
        this.data.push(element)
    }
    public peek(offset: any): void {
        const index = this.data.length - (offset || 1)
        if (0 <= index && index < this.data.length)
            return this.data[index]
        else
            throw "Attempted to peek at invalid stack index " + index + ": " + this.stackName
    }
    public roll(num: number): void {
        if (num === 0)
            return
        const index = this.data.length - num - 1
        if (0 <= index && index < this.data.length) {
            const newTop = this.data.splice(index, 1)[0]
            this.data.push(newTop)
        }
        else
            throw "Attempted to roll more elements than in stack " + num + ": " + this.stackName
    }
    public length(): number {
        return this.data.length
    }
    public clear(): void {
        this.data = []
    }
    public toString(): string {
        return this.data.toString()
    }
    public getStack(): any[] {
        const dataClone = [...this.data]
        return dataClone
    }
}

export default Stack