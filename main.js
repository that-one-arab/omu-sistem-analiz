const path = require('path')
const { app, BrowserWindow } = require('electron')
const isDev = !app.isPackaged

require('dotenv').config({
    path: isDev ? './.env' : path.join(__dirname, '../.env'),
})

const url = require('url')
const fs = require('fs')

console.info('process.env: ', process.env)
console.info('db host: ', process.env.DB_HOST)

require('./server') // This will run the Express server

console.info('isDev:', isDev)

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
        path.join(__dirname, '../client/build', 'index.html')
    )

    // Load the React app
    const startURL = isDev
        ? 'http://localhost:3000'
        : url.format({
              pathname: path.join(__dirname, '../client/build', 'index.html'),
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

app.on('ready', () => {
    // List directories inside resources
    const resourcesPath = path.join(process.resourcesPath)
    fs.readdir(resourcesPath, (err, files) => {
        if (err) {
            console.error('Error reading resources directory', err)
        } else {
            console.log('Directories and files in resources:', files)
            files
                .filter((file) => {
                    if (
                        !fs
                            .statSync(path.join(resourcesPath, file))
                            .isDirectory()
                    )
                        console.log('File:', file)
                    return fs
                        .statSync(path.join(resourcesPath, file))
                        .isDirectory()
                })
                .forEach((dir) => {
                    console.log('Directory:', dir)
                })
        }
    })
})

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
