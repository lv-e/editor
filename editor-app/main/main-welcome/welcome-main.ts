import { BrowserWindow } from "electron";
import { join } from 'path';
import { format as formatUrl } from 'url';
import { isDevelopment } from "..";
import { ipc } from "../components/electron/ipcMain";
import { RecentFiles } from "../managers/recent-files";
import { createNewProject } from "./message-handlers/new-project";
import { openProject } from "./message-handlers/open-project";

let welcomeWindow:BrowserWindow | null = null

// IPC messages for welcome
export function bootstrap() {
    
    ipc.welcome
        .on('show', presentWelcome)
        .on('close', closeWelcome)
        .on('open-project', openProject) 
        .provideAsync("new-project", (_args, completion) => {
            createNewProject( file => completion(file))
        })
        .provideSync("recent-projects",  _e => {
            return RecentFiles.shared().getAll
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