/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { ipcRenderer } from "electron"
import Gforth from './Gforth'


const _global = global as any;
_global.gforth = new Gforth()
if (_global.gforth.fatal.error) {
    ipcRenderer.send('app-close', _global.gforth.fatal.msg)
}

ipcRenderer.on("alive", (_: Event, msg: string): void => {
    console.log(msg);
});

ipcRenderer.on("file-open", (_: Event, file: string): void => {
    console.log(file)
    _global.gforth.fileOpen(file)
});
