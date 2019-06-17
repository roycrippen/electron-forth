export class Header {
    public constructor(link: Function, name: string | null, immediate: boolean, hidden: boolean, executionToken: string) {
        this.link = link
        this.name = name
        this.immediate = immediate || false
        this.hidden = hidden || false
        this.executionToken = executionToken
    }
    public link: Function
    public name: string | null
    public immediate: boolean
    public hidden: boolean
    public executionToken: string
}