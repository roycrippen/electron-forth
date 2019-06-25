/* eslint-disable no-console */

import Forth from './forth'
import fs from 'fs'
import path from 'path'

class Include {
    public constructor(f: Forth) {
        const include = (): void => {
            let file = f._readWord();
            let [body, err] = this.readSrc(file)
            if (err.length == 0) {
                const xs = body.trim().split('\n')
                xs.forEach((element: string): void => {
                    f.run(`${element}\n`)
                });
                f.endOfInput = true
            } else {
                console.error(err)
            }
        }

        f.defjs("include", include);
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