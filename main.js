const { app, BrowserWindow } = require('electron')
const path = require('path')

require('./server') // This will run the Express server

const isDev = !app.isPackaged

// eslint-disable-next-line require-jsdoc
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    // Load the React app
    const startURL = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`

    win.loadURL(startURL)

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
