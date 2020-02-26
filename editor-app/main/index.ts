import {app, BrowserWindow, ipcMain, dialog} from "electron"

app.on('ready', () => {
    console.log("electron is ready")
    presentWelcome()
})

ipcMain.on('open-file', (event, data)  => {
    console.log('message received on main process')
    dialog.showOpenDialog(null,{}).then( () => {
        console.log("asd")
    })
})

function presentWelcome() {
    let window = new BrowserWindow({
        width:600,
        height:400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadURL("http://localhost:4100/")
    window.show()
}
