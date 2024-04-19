const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

// require('./server') // This will run the Express server

// const isDev = !app.isPackaged
const isDev = true

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

    console.info(
        'path to client build',
        path.join(__dirname, 'client/build', 'index.html')
    )

    // Load the React app
    const startURL = isDev
        ? 'http://localhost:3000'
        : url.format({
              pathname: path.join(__dirname, 'client/build', 'index.html'),
              protocol: 'file:',
              slashes: true,
          })

    win.loadURL(startURL)
    // win.loadURL(
    //     url.format({
    //         pathname: path.join(__dirname, 'client/build', 'index.html'),
    //         protocol: 'file:',
    //         slashes: true,
    //     })
    // )

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
