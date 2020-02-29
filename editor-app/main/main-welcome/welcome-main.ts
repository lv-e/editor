import { BrowserWindow, ipcMain, dialog } from "electron"
import * as path from 'path'
import { format as formatUrl } from 'url'
import { isDevelopment } from ".."

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('welcome:open-file', showOpenFileDialog)
    ipcMain.on('welcome:show', presentWelcome)    
}

let welcomeWindow:BrowserWindow = null

function showOpenFileDialog(event:Electron.IpcMainEvent){

    // focus on welcome window, recreating if necessary
    presentWelcome(event)
    
    // show an open file dialog
    dialog.showOpenDialog(null,{
        title: "open project", properties: ["openFile"],
        filters:[{ name: "project", extensions:["lvproject"] }]
    }).then( (data:Electron.OpenDialogReturnValue) => {
        if (!data.canceled) {
            let choosen = data.filePaths[0]
            event.reply("welcome:project-choosen", choosen)
        }
    })
}

function presentWelcome(event:Electron.IpcMainEvent) {
    
    if (welcomeWindow == null) {

        welcomeWindow = new BrowserWindow({
            width:600, height:400,
            frame: false, resizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        })

        if (isDevelopment) welcomeWindow.loadURL("http://localhost:4100/")
        else welcomeWindow.loadURL( formatUrl( {
            pathname: path.join(__dirname, "welcome", 'index.html'),
            protocol: 'file',
            slashes: true
        }))
        
        welcomeWindow.show()
    }

    welcomeWindow.focus()
}