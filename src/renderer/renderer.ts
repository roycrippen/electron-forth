/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { ipcRenderer } from "electron";
import Repl from './engine/repl'
import Forth from './engine/forth'

ipcRenderer.on("ping", (_: Event, msg: string): void => {
    console.log(msg);
    ipcRenderer.send("pong", "pong message!");
});

const _global = global as any;
_global.repl = new Repl(new Forth());
