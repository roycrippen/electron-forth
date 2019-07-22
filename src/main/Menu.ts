import { dialog, MenuItemConstructorOptions, OpenDialogOptions } from "electron";

const options: OpenDialogOptions = {
    properties: ['openFile']
}


const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'File Open...',
                click() {
                    dialog.showOpenDialog(options, (files): string[] => {
                        if (files !== undefined) {
                            return files
                        }
                        return []
                    })
                    console.log('file-open', 'aaa')
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

export default template