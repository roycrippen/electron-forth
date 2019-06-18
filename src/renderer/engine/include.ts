/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

// import request from 'request'
// import url from 'url'
import fs from 'fs'
import InputExceptions from './input-exceptions'

class Include {
    public constructor(f: any) {
        let includes: string[] = []

        const isIncluded = (file: string): boolean => {
            return includes.indexOf(file) > -1
        }

        const include = (): void => {
            let outputCallback = f.outputCallback;

            let file = f._readWord();
            if (isIncluded(file)) {
                const msg = `${file} already included`
                console.log(msg)
                f.writeMessage('_', msg)
                return
            } else {
                if ((process as any).browser || file.match(/^http/)) {
                    const err = "Failed to load http file " + file +
                        ". This functionality has been removed";
                    console.error(err);
                    f.writeMessage('_', err)
                } else {
                    try {

                        let body = fs.readFileSync(file, 'utf8');
                        f.writeMessage('_', `loaded: ${file}`)
                        includes.push(file)
                        f.run(body, outputCallback, file);

                    } catch (error) {
                        const err = `Failed to load file ${file}. ${error}`
                        console.error(err)
                        f.writeMessage('_', err)
                    }
                }
                throw InputExceptions.WaitingOnInput;
            }
        }

        f.defjs("include", include, true);
    }
}
// module.exports = Include;
export default Include;