import Forth from "../src/renderer/engine/forth";

class HeadlessRepl{
    public ErrorString: string = '';
    public ForthEng: Forth = new Forth();
    public OutputString: string = '';
    public InputString: string = '';
    public constructor(loadForth: boolean){
        if (loadForth){
            let loadResult = this.loadForth();
            if (!loadResult){
                this.OutputString += "";
            }
        }

    }
    protected handleOutput(err: string, output: string): void{
        this.OutputString += output;
        this.ErrorString += err;
    }

    /**
     * Loads base forth as input file
     * @param forthPath path to forth file to include
     */
    public loadForth(forthPath: string = '../forth/forth.fth'): boolean{
        
        //just use include to process loading forth
        this.ForthEng.run(`include ${forthPath}`, this.handleOutput);
        //this will limit our # of mirrored implementations(right now there are 2)


        //return false until this is implemented
        return true;
    }
    
}