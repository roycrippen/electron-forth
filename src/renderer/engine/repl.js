/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
// var Forth = require("./forth.js");

import Forth from './forth'

class Repl {
    constructor() {
        let forth = new Forth();

        const writeMessage = (output, message) => {
            if (output.trim() !== "") {
                const outNode = document.getElementById("output")
                outNode.value += `${output.trim()}\n`
                outNode.scrollTop = outNode.scrollHeight

                const msgNode = document.getElementById("message")
                msgNode.value += `${message.trim()}\n`
                msgNode.scrollTop = msgNode.scrollHeight
            }
        }

        const clearMessages = () => {
            document.getElementById("output").value = ""
            document.getElementById("message").value = ""
        }

        function showStack () {
            const stackStr = forth.stack.getStack().reverse().join('\n');
            const stackNode = document.getElementById("stack");
            stackNode.value = stackStr;
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
            // todo: fails on first run load of include
            let inputNode = document.getElementById("input");
            let input = inputNode.value.trim();
            if (input) {
                const xs = input.split('\n')
                xs.forEach(element => {
                    forth.run(`${element}\n`, onForthOutput)
                });
                // forth.run(input, onForthOutput);
            }
        }

        function loadForth (file) {
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    forth.run(xmlhttp.responseText, onForthOutput);
                }
            };
            xmlhttp.open("GET", file, true);
            xmlhttp.send();
        }

        loadForth("../forth/forth.fth")
        forth.writeMessage = writeMessage
        forth.clearMessages = clearMessages

        return {
            interpret: function (event) {
                if (event.key === "Enter" && event.ctrlKey) {
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
