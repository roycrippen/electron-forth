/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'

class Include {
    public constructor(f: any) {
        // const inlineIncludes = (file: string): [string, string] => {
        //     let [src, err] = this.readSrc(file)
        //     if (err.length > 0) {
        //         return ["", err]
        //     }

        //     let pos = src.indexOf("include ")
        //     let comment = pos > -1 ? src.slice(pos - 2, pos) == '\\ ' : false
        //     while (pos > -1 && !comment) {
        //         let fileInline = this.readWord(src.slice(pos + 8, pos + 100))
        //         let [inline, err] = inlineIncludes(fileInline)
        //         if (err.length > 0) {
        //             return ["", err]
        //         }
        //         src = src.replace(`include ${fileInline}`, inline)
        //         pos = src.indexOf("include ")
        //         comment = pos > -1 ? src.slice(pos - 2, pos) == '\\ ' : false
        //     }
        //     return [src, ""]
        // }

        const include = (): void => {
            let file = f._readWord();
            // let [body, err] = inlineIncludes(file)
            let [body, err] = this.readSrc(file)
            if (err.length == 0) {
                const xs = body.trim().split('\n')

                xs.forEach((element: string): void => {
                    f.run(`${element}\n`)
                });
                f.endOfInput = true
            } else {
                console.error(err)
                f.writeMessage('_', err)
            }
        }

        f.defjs("include", include);
    }

    // private readWord(src: string): string {
    //     let s = "";
    //     for (const c of src) {
    //         if (c == ' ' || c == '\n') {
    //             return s
    //         } else {
    //             s += c
    //         }

    //     }
    //     return ""
    // }

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