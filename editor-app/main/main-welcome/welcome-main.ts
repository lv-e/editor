import { BrowserWindow, dialog, ipcMain } from "electron";
import { join } from 'path';
import { format as formatUrl } from 'url';
import { isDevelopment } from "..";
import { RecentFiles } from "../managers/recent-files";

import Store = require('electron-store');

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('welcome:open-project', showOpenFileDialog)
    ipcMain.on('welcome:show', presentWelcome)
    ipcMain.on('welcome:close', closeWelcome)
    ipcMain.on('welcome:get-recent-projects', getRecentProjects)
}

let welcomeWindow:BrowserWindow | null = null

function getRecentProjects(event:Electron.IpcMainEvent){
    const files = RecentFiles.shared().getAll
    console.log("sending recent files...")
    event.reply("welcome:set-recent-projects", files)
}

function showOpenFileDialog(event:Electron.IpcMainEvent){

    if (welcomeWindow == null) return

    // focus on welcome window, recreating if necessary
    presentWelcome(event)
    
    // show an open file dialog
    dialog.showOpenDialog( null, {
        title: "open project", properties: ["openFile"],
        filters:[{ name: "project", extensions:["lvproject"] }]
        
    }).then( (data:Electron.OpenDialogReturnValue) => {
        if (!data.canceled) {
            let choosen = data.filePaths[0]
            event.reply("welcome:project-choosen", choosen.trim())
            
            const store = new Store()
            store.set('unicorn', '🦄')
	        console.log(store.get('unicorn'))
            
            ipcMain.emit("welcome:close")
        }
    })
}

function closeWelcome(event:Electron.IpcMainEvent) {
    if(welcomeWindow) welcomeWindow.close()
    welcomeWindow = null
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

        if (isDevelopment) 
            welcomeWindow.loadURL("http://localhost:4100/")
        else welcomeWindow.loadURL( formatUrl( {
            pathname: join(__dirname, "welcome", 'index.html'),
            protocol: 'file',
            slashes: true
        }))
        
        welcomeWindow.show()
    }

    welcomeWindow.focus()
}