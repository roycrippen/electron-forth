/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import request from 'request'
import url from 'url'
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
                    if ((process as any).browser) file = url.resolve(location.href, file);
                    request.get(file, function (error: string, response: any, body: string): void {
                        if (!error && response.statusCode == 200) {
                            includes.push(file)
                            f.run(body, outputCallback, file.toString());
                        } else {
                            console.error("Failed to load http file " + file + ". " + error);
                        }
                    });
                } else {
                    fs.readFile(file, "utf8", function (error: any, body: string): void {
                        if (!error) {
                            f.writeMessage('_', `loaded: ${file}`)
                            includes.push(file)
                            f.run(body, outputCallback, file);
                        } else {
                            const err = `Failed to load file ${file}. ${error}`
                            console.error(err)
                            f.writeMessage('_', err)
                        }
                    });
                }
                throw InputExceptions.WaitingOnInput;
            }
        }

        f.defjs("include", include, true);
    }
}
// module.exports = Include;
export default Include;