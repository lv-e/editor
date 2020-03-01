import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { isDevelopment } from "..";
import { join, dirname } from 'path'
import { format as formatUrl } from 'url'
import Dockerode, { Container, Exec, ContainerCreateOptions } from 'dockerode-ts';
import { DockerInterface } from "./docker-interface";
import { performance } from 'perf_hooks'

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('editor:open-project', openProject)
    ipcMain.on('editor:start-docker', startDocker)
}

let editors:BrowserWindow[] = new Array<BrowserWindow>()
let docker = new Dockerode()

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

function startDocker(event:IpcMainEvent, path:string) {
    DockerInterface.accessForProject(path).withContainer( (container) => {
        event.reply("editor:container-id-updated", path, container.id)
        
        function doScan(times:number) {
            var t0 = performance.now();
            DockerInterface.accessForProject(path).scan( (data => {
                var t1 = performance.now();
                console.log("Call " + times + " to scan took " + (t1 - t0) + " milliseconds.");
                if(times - 1 > 0 ) doScan(times - 1)
            }))   
        }

        doScan(100)
    })
}