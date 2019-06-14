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
        var outputCallback = f.outputCallback;

        var file = f._readWord();
        if (isIncluded(file)) {
            console.log(`file: ${file} is already included, nothing done.`)
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
    });

    return f;
}

// module.exports = Include;
export default Include;