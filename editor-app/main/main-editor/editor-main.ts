import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { isDevelopment } from "..";
import { join, basename } from 'path'
import { format as formatUrl } from 'url'
import { DockerInterface } from "./docker-interface";
import * as cli from '@lv-game-editor/lv-cli'
import {watch} from 'chokidar'

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('editor:open-project', openProject)
    ipcMain.on('editor:scan-project-files', scanProjectFiles)
    ipcMain.on('editor:close', (event, path) => DockerInterface.accessForProject(path).stop())
}

function openProject(event:any, path:string) {

    let newEditor = new BrowserWindow({
        minWidth: 320, minHeight: 200, 
        width:800, height:600,
        frame: true, resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (isDevelopment) {
        newEditor.loadURL("http://localhost:4300/?path=+" + encodeURIComponent(path))
        newEditor.webContents.openDevTools({mode: "detach"})
    } else newEditor.loadURL( formatUrl( {
        pathname: join(__dirname, "editor", 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    newEditor.on('close', () => {
        console.log("editor is closing for " + path)
        ipcMain.emit("editor:close", null, path)
    })
    
    newEditor.show()
}

function scanProjectFiles(event:IpcMainEvent, path:string){

    let access = DockerInterface.accessForProject(path)
    access.withContainer( () =>{

        const watcher = watch(access.dir(), {
            ignored: /^\./,
            persistent: true,
            ignoreInitial: true
        })

        watcher
            .on('add', scan).on('unlink', scan)
            .on('addDir', scan).on('unlinkDir', scan)
    
        function scan(file?:string){
            if (file != null && basename(file).startsWith(".")) return
            DockerInterface.accessForProject(path).scan( (data:cli.rootFolders) => {
                event.reply("editor:project-files-updated", path, data)
            })
        }

        ipcMain.on("editor:close", (event:IpcMainEvent, eventPath:string) => {
            if(eventPath.trim() != path.trim()) return
            watcher.removeAllListeners()
        })

        scan()
    })
    
}