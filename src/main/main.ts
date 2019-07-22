import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItemConstructorOptions, OpenDialogOptions } from "electron";
import * as path from "path";

// let windows: [Electron.BrowserWindow]
// let mainWindow: Electron.BrowserWindow | null;
let mainWindow: BrowserWindow;


const options: OpenDialogOptions = {
    properties: ['openFile'],
    defaultPath: app.getAppPath()
}


const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'File Open...',
                click() {
                    dialog.showOpenDialog(mainWindow, options, (files) => {
                        if (files !== undefined) {
                            mainWindow.webContents.send('file-open', files[0])
                        }
                    })
                }
            },
            { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { console.log('help menu clicked') }
            }
        ]
    }
]


const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 1200,
        width: 2400,
        title: 'Electron Gforth',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on("did-finish-load", (): void => {
        mainWindow.webContents.send("alive", "gforth application is alive");
    });

    // Emitted when the window is closed.
    mainWindow.on("closed", (): void => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // mainWindow = null;
    });

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
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

ipcMain.on("app-close", (_: Event, msg: string): void => {
    dialog.showErrorBox('Electron GForth', `Application had a fatal error.\n${msg}`)
    app.quit()
});

