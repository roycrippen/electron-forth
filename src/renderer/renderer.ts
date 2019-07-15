/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { ipcRenderer } from "electron"
import Gforth from './Gforth'

ipcRenderer.on("ping", (_: Event, msg: string): void => {
    console.log(msg);
    ipcRenderer.send("pong", "pong message!");
});

const _global = global as any;
_global.gforth = new Gforth()
if (_global.gforth.fatal.error) {
    ipcRenderer.send('app-close', _global.gforth.fatal.msg)
}
