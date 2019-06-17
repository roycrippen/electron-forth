/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { ipcRenderer } from "electron";
import Repl from './engine/repl'

ipcRenderer.on("ping", (_: Event, msg: string): void => {
    console.log(msg);
    ipcRenderer.send("pong", "pong message!");
});

// const interpret = (event: any): void => {
//     if (event.key === " ") {
//         console.log("key code , Space");
//     } else if (event.key === "Enter" && !event.shiftKey) {
//         console.log("key code 13, Enter");
//     } else if (event.key === ";" && !event.shiftKey) {
//         console.log("key code 186, ';'");
//     }
// };

const _global = global as any;
_global.repl = new Repl();
