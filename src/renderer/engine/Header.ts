class Header {
    public link: number | null
    public name: string | null
    public immediate: boolean
    public hidden: boolean
    public executionToken: string

    public constructor(
        link: number | null,
        name: string | null,
        immediate: boolean,
        hidden: boolean,
        executionToken: string
    ) {
        this.link = link
        this.name = name
        this.immediate = immediate || false
        this.hidden = hidden || false
        this.executionToken = executionToken
    }
}

export default Header