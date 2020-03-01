import { ipcMain, BrowserWindow, IpcMainEvent } from "electron";
import { isDevelopment } from "..";
import { join, dirname } from 'path'
import { format as formatUrl } from 'url'
import Dockerode, { Container, Exec } from 'dockerode-ts';

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

function streamToString (stream:any) {
    const chunks:Uint8Array[] = []
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk:Uint8Array) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}

function runScan(containerID:string) {
    let container = docker.getContainer(containerID)
    if (container != null) {
        let command = ["lv-cli", "verbose", "scan", "-i", "/tmp/project", "-o", "/tmp/project/.build/project.json"]
        container.exec({Cmd:command}, (err, command:Exec) => {
                if (err != null) {
                    console.log("error:", err)
                } else {
                    command.start({}, (error, data) => {
                        if (error != null) {
                            console.log("error:", err)
                        } else {
                            streamToString(data).then( (str) => {
                                console.log("--" + str + "--")
                            })
                        }
                    })
                }
            }
        ) 
    }
}

function startDocker(event:IpcMainEvent, path:string) {
    
    let dir = dirname(path).trim()
    
    docker.createContainer({ 
      Image: 'lvedock/lve_runtime',
      Tty: true,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig:{
        Binds:[dir + ":/tmp/project"]
      }
    }, (error:any, container:Container | undefined) => {
      if(container != undefined){
        container.start((error:any, data:any) => {
          if (error == null) {
              console.log("Container is up! id is: " + container.id)
              event.reply("editor:container-id-updated", dir, container.id)
              runScan(container.id)
          } else console.error("Can't start cli container! reason: ", error)
        });
      } else {
        console.error("can't load cli container. reason: ", error)
      }
    })
}