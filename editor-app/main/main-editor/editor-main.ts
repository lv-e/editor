import * as cli from '@lv-game-editor/lv-cli';
import { watch } from 'chokidar';
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { basename, join } from 'path';
import { format as formatUrl } from 'url';
import { isDevelopment } from "..";
import { openSimulator } from "../main-simulator/simulator-main";
import { DockerInterface } from "./docker-interface";

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('editor:open-project', openProject)
    ipcMain.on('editor:scan-project-files', scanProjectFiles)
    ipcMain.on('editor:build', runBuild)
    ipcMain.on('editor:open-simulator', callSimulator)
    ipcMain.on('editor:close', (event, path) => {
        ipcMain.emit("simulator:close", event, path)
        DockerInterface.accessForProject(path).stop()
    })
}

function callSimulator(event:any, path:string){
    openSimulator(path)
}

function runBuild(event:any, path:string){

    console.log("starting build for: " + path)
    let access = DockerInterface.accessForProject(path)

    function build(){
        access.build( success => {
            if (!success) throw new Error("can't build project!\n")
            console.log("yeah, man!")
        })
    }

    access.encode( success => {
        if (!success) throw new Error("can't encode project!\n")
        console.log("done encoding, will now compile\n")
        build()
    })
    
}

export function openProject(event:any, path:string) {

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
            if (file != null && file.includes(".shared/")) return
            if (file != null && file.includes(".bin/")) return
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