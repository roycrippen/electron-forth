export class Header {
    public constructor(link: number, name: string, immediate: boolean, hidden: boolean, executionToken: string) {
        this.link = link
        this.name = name
        this.immediate = immediate || false
        this.hidden = hidden || false
        this.executionToken = executionToken
    }
    public link: number
    public name: string
    public immediate: boolean
    public hidden: boolean
    public executionToken: string
}
