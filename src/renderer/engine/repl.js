/* eslint-disable no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires
// var Forth = require("./forth.js");

import Forth from './forth'

export function Repl () {
    var forth = Forth();
    // var inputHistory = [""];
    // var historyCount = 0;
    // var historySelection = 0;

    // function useHistory (selection) {
    //     var inputNode = document.getElementById("input");

    //     if (inputNode.value !== inputHistory[historySelection]) {
    //         historySelection = historyCount - 1;
    //         inputHistory[historyCount] = inputNode.value;
    //     } else {
    //         historySelection = Math.min(Math.max(selection, 0), inputHistory.length - 1);
    //     }

    //     inputNode.value = inputHistory[historySelection];
    //     inputNode.selectionStart = inputNode.value.length;
    // }

    // function updateHistory (input) {
    //     // Remove duplicates
    //     for (var i = inputHistory.length - 1; i >= 0; i--) {
    //         if (inputHistory[i] === input) {
    //             inputHistory.splice(i, 1);
    //             historyCount--;
    //         }
    //     }
    //     inputHistory[historyCount] = input;
    //     historyCount = inputHistory.length;
    //     historySelection = inputHistory.length;
    //     inputHistory.push("");
    // }

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
    // const writeOutput = (text) => {
    //     let s = `${text.trim()}\n`
    //     if (s.length > 1) {
    //         const outputNode = document.getElementById("output")
    //         outputNode.value += s
    //         outputNode.scrollTop = outputNode.scrollHeight
    //         writeMessage('ok\n')
    //     }
    // }

    // function createReplNode (icon, text, className) {
    //     if (!text) return;

    //     var textNode = document.createElement("textarea");
    //     textNode.className = className;
    //     textNode.readOnly = true;
    //     textNode.cols = 80;
    //     textNode.value = icon + " " + text;

    //     var replNode = document.createElement("div");
    //     replNode.appendChild(textNode);

    //     var outputNode = document.getElementById("output");
    //     outputNode.appendChild(replNode);

    //     setTimeout(function () {
    //         textNode.style.height = textNode.scrollHeight + "px";
    //         outputNode.scrollTop = outputNode.scrollHeight - outputNode.clientHeight;
    //     }, 0);
    // }

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
        var inputNode = document.getElementById("input");
        var input = inputNode.value.trim();
        if (input) {
            const xs = input.split('\n')
            xs.forEach(element => {
                forth.run(element, onForthOutput)
            });
            // forth.run(input, onForthOutput);
        }
    }

    function loadForth (file) {
        var xmlhttp = new XMLHttpRequest();
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
                // console.log("run commands");
                forth.stack.clear()
                clearMessages()
                runforth()
            }
        }
    }
}

export default Repl;
