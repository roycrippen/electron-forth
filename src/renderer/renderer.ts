/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { ipcRenderer } from "electron";
import Repl from './engine/repl'

ipcRenderer.on("ping", (_: Event, msg: string): void => {
    console.log(msg);
    ipcRenderer.send("pong", "pong message!");
});

const _global = global as any;
_global.repl = new Repl();
