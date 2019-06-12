// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer } from "electron";
import { double } from "./util";

ipcRenderer.on("ping", (_: Event, msg: string) => {
  console.log(msg);
  ipcRenderer.send("pong", "pong message! " + double(100).toString());
});

const interpret = (event: any) => {
  if (event.key === " ") {
    console.log("key code , Space");
  } else if (event.key === "Enter" && !event.shiftKey) {
    console.log("key code 13, Enter");
  } else if (event.key === ";" && !event.shiftKey) {
    console.log("key code 186, ';'");
  }
};

const _global = global as any;
_global.repl = interpret;
