/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
// var Forth = require("./forth.js");

import Forth from './forth'
import fs from 'fs'
import path from 'path'

class Repl {
    constructor() {
        let forth;

        const writeMessage = (output, message) => {
            if (output.trim() !== "") {
                const outNode = document.getElementById("output")
                if (outNode) {
                    outNode.value += `${output.trim()}\n`
                    outNode.scrollTop = outNode.scrollHeight
                }

                const msgNode = document.getElementById("message")
                if (msgNode) {
                    msgNode.value += `${message.trim()}\n`
                    msgNode.scrollTop = msgNode.scrollHeight
                }
            }
        }

        const clearMessages = () => {
            document.getElementById("output").value = ""
            document.getElementById("message").value = ""
        }

        function showStack () {
            const stackStr = forth.stack.getStack().reverse().join('\n');
            const stackNode = document.getElementById("stack");
            if (stackNode) {
                stackNode.value = stackStr
            }
        }

        function onForthOutput (error, output) {
            if (error) {
                writeMessage('_', error)
            } else {
                writeMessage(output, 'ok')
            }
            showStack();
        }

        function runforth () {
            let inputNode = document.getElementById("input");
            let input = inputNode.value.trim();
            if (input) {
                const xs = input.split('\n')
                xs.forEach(element => {
                    forth.run(`${element}\n`)
                });
            }
        }

        function loadForth (file) {
            // let xmlhttp = new XMLHttpRequest();
            // xmlhttp.onreadystatechange = function () {
            //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //         forth.run(xmlhttp.responseText);
            //     }
            // };
            // xmlhttp.open("GET", file, true);
            // xmlhttp.send();
            try {
                let src = fs.readFileSync(file, 'utf8')
                forth.run(src)
            } catch (e) {
                const err = `Failed to load and execute forth file ${file}. ${e}`
                throw err
            }
        }

        const initForth = () => {
            forth = new Forth();
            forth.writeMessage = writeMessage
            forth.clearMessages = clearMessages
            forth.onForthOutput = onForthOutput
            loadForth("forth/forth.fth")
        }

        initForth()

        return {
            interpret: function (event) {
                if (event.key === "Enter" && event.ctrlKey) {
                    initForth()
                    forth.stack.clear()
                    clearMessages()
                    forth._currentInput = null
                    runforth()
                }
            }
        }
    }
}

export default Repl;
