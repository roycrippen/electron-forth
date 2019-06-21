/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

// import request from 'request'
// import url from 'url'
import InputExceptions from './input-exceptions'
import fs from 'fs'
import path from 'path'

class Include {
    public constructor(f: any) {
        const include = (): void => {
            let file = f._readWord();
            let [body, err] = inlineIncludes(file)
            // let [body, err] = this.readSrc(file)
            if (err.length == 0) {
                const xs = body.trim().split('\n')
                xs.forEach(element => {
                    f.run(`${element}\n`)
                });
                throw InputExceptions.EndOfInput;
            } else {
                console.error(err)
                f.writeMessage('_', err)
            }
        }

        const inlineIncludes = (file: string): [string, string] => {
            let [src, err] = this.readSrc(file)
            if (err.length > 0) {
                return ["", err]
            }

            // f.writeMessage('_', `loaded: ${file}`)
            let pos = src.indexOf("include ")
            while (pos > -1) {
                let fileInline = this.readWord(src.slice(pos + 8, pos + 100))
                let [inline, err] = inlineIncludes(fileInline)
                if (err.length > 0) {
                    return ["", err]
                }
                src = src.replace(`include ${fileInline}`, inline)
                pos = src.indexOf("include ")
            }
            return [src, ""]
        }

        f.defjs("include", include, true);
    }

    private readWord(src: string): string {
        let s = "";
        for (const c of src) {
            if (c == ' ' || c == '\n') {
                return s
            } else {
                s += c
            }

        };
        return ""
    }

    private readSrc(file: string): [string, string] {
        if (file.startsWith('~+')) {
            file = `.${file.slice(2)}`
        }
        try {
            let src = fs.readFileSync(file, 'utf8')
            return [src, ""]
        } catch (e) {
            const err = `Failed to load file ${path}. ${e}`
            return ["", err]
        }
    }
}

export default Include;