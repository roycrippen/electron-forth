// import Forth from "./src/renderer/engine/forth";
var Forth = require("./src/renderer/engine/forth.js");

export function Repl() {
  var forth = Forth();

  function loadForth(file) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        forth.run(xmlhttp.responseText, onForthOutput);
      }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();
  }
  loadForth("forth/forth.fth");

  var inputHistory = [""];
  var historyCount = 0;
  var historySelection = 0;

  function useHistory(selection) {
    var inputNode = document.getElementById("input");

    if (inputNode.value !== inputHistory[historySelection]) {
      historySelection = historyCount - 1;
      inputHistory[historyCount] = inputNode.value;
    } else {
      historySelection = Math.min(Math.max(selection, 0), inputHistory.length - 1);
    }

    inputNode.value = inputHistory[historySelection];
    inputNode.selectionStart = inputNode.value.length;
  }

  function updateHistory(input) {
    // Remove duplicates
    for (var i = inputHistory.length - 1; i >= 0; i--) {
      if (inputHistory[i] === input) {
        inputHistory.splice(i, 1);
        historyCount--;
      }
    }
    inputHistory[historyCount] = input;
    historyCount = inputHistory.length;
    historySelection = inputHistory.length;
    inputHistory.push("");
  }

  function createReplNode(icon, text, className) {
    if (!text) return;

    var textNode = document.createElement("textarea");
    textNode.className = className;
    textNode.readOnly = true;
    textNode.cols = 80;
    textNode.value = icon + " " + text;

    var replNode = document.createElement("div");
    replNode.appendChild(textNode);

    var outputNode = document.getElementById("output");
    outputNode.appendChild(replNode);

    setTimeout(function () {
      textNode.style.height = textNode.scrollHeight + "px";
      outputNode.scrollTop = outputNode.scrollHeight - outputNode.clientHeight;
    }, 0);
  }

  function onForthOutput(error, output) {
    createReplNode("\u2190", output, "forth-output");
    if (error) {
      createReplNode("X", error, "error");
    }
    showStack();
  }

  function runforth() {
    var inputNode = document.getElementById("input");
    var input = inputNode.value.trim();
    if (input) {
      updateHistory(input);
      createReplNode("\u2192", input, "user-output");
      inputNode.value = "";
      forth.run(input, onForthOutput);
    }
  }

  function showStack() {
    var stack = forth.stack;
    var stackNode = document.getElementById("stack");
    // Clear stack
    while (stackNode.firstChild) stackNode.removeChild(stackNode.firstChild);

    for (var i = 1; i <= stack.length(); i++) {
      var element = document.createElement("span");
      element.className = "stack-element";
      element.textContent = String(stack.peek(i));
      stackNode.appendChild(element);
    }
  }

  return {
    interpret: function (event) {
      //     if (event.keyCode == 13 && !event.shiftKey)
      //         runforth();
      //     else if (event.keyCode == 80 && event.ctrlKey)
      //         useHistory(historySelection - 1);
      //     else if (event.keyCode == 78 && event.ctrlKey)
      //         useHistory(historySelection + 1);
      // }
      if (event.key === " ") {
        // tslint:disable-next-line: no-console
        console.log("key code , Space");
      } else if (event.key === "Enter" && !event.shiftKey) {
        // tslint:disable-next-line: no-console
        console.log("key code 13, Enter");
      } else if (event.key === ";" && !event.shiftKey) {
        // tslint:disable-next-line: no-console
        console.log("key code 186, ';'");
      }
    }
  };
}

// export default Repl;