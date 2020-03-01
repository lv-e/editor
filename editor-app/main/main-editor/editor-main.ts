import { ipcMain, BrowserWindow } from "electron";
import { isDevelopment } from "..";
import { join } from 'path'
import { format as formatUrl } from 'url'

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('editor:open-project', openProject)
}

let editors:BrowserWindow[] = new Array<BrowserWindow>()

function openProject(event:any, path:string) {

    let newEditor = new BrowserWindow({
        minWidth: 320, minHeight: 200, 
        width:800, height:600,
        frame: true, resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (isDevelopment) newEditor.loadURL("http://localhost:4300/?path=+" + encodeURIComponent(path))
    else newEditor.loadURL( formatUrl( {
        pathname: join(__dirname, "editor", 'index.html'),
        protocol: 'file',
        slashes: true
    }))
    
    newEditor.show()
}