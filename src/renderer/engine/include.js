/* eslint-disable no-console */

import request from 'request'
import url from 'url'
import fs from 'fs'
import InputExceptions from './input-exceptions'

function Include (f) {
    let includes = []

    const isIncluded = (file) => {
        return includes.indexOf(file) > -1
    }

    f.defjs("include", function () {
        let outputCallback = f.outputCallback;

        let file = f._readWord();
        if (isIncluded(file)) {
            const msg = `${file} already included`
            console.log(msg)
            f.writeMessage('_', msg)
            return
        } else {
            if (process.browser || file.match(/^http/)) {
                if (process.browser) file = url.resolve(location.href, file);
                request.get(file, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        includes.push(file)
                        f.run(body, outputCallback, file.toString());
                    } else {
                        console.error("Failed to load http file " + file + ". " + error);
                    }
                });
            } else {
                fs.readFile(file, "utf8", function (error, body) {
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
    }, true);

    return f;
}

// module.exports = Include;
export default Include;