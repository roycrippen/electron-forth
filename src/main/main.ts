import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

// let windows: [Electron.BrowserWindow]
// let mainWindow: Electron.BrowserWindow | null;
let mainWindow: BrowserWindow;

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 1200,
        width: 2400,
        title: "my window title",
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on("did-finish-load", (): void => {
        mainWindow.webContents.send("ping", "ping message! aaa");
    });

    // Emitted when the window is closed.
    mainWindow.on("closed", (): void => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", (): void => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", (): void => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("pong", (_: Event, msg: string): void => {
    // eslint-disable-next-line no-console
    console.log(msg);
});
