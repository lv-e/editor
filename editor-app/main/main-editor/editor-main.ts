import { BrowserWindow, IpcMainEvent } from "electron";
import { ipc } from "../components/electron/ipcMain";
import * as handler from "./message-handlers/index";

export type Editor = {path:string, browserWindow:BrowserWindow}

export class EditorScreen {

    // singleton access
    private static instance: EditorScreen;
    static get shared(): EditorScreen {
        if (!EditorScreen.instance) EditorScreen.instance = new EditorScreen();
        return EditorScreen.instance;
    }

    // current window managment 
    private editorWindows:Editor[] = []

    pathForEvent(e:IpcMainEvent) : (string | null) {
        let window = this.windowForEvent(e)
        return this.editorWindows.find( edt => edt.browserWindow.id == window.id).path
    }

    windowForEvent(e:IpcMainEvent) : (BrowserWindow | null) {
        return BrowserWindow.fromWebContents(e.sender)
    }
    
    // ipc messages handling
    bootstrap() {
        ipc.editor
            .on('open-project', (_e, path) =>
                this.editorWindows.push({
                    path: path, browserWindow: handler.openProject(path)
                })
            )
            .on('close', e => 
                handler.close(e)
            )
            .on('save-project', (e, data) => 
                handler.saveProject(e, data)
            )
            .provideSync("read-project", event => {
                return handler.readProjectFile(event)
            })
            .provideAsync("project-changes", (event, args, completion) =>
                handler.projectChanges( event, project => completion(project))
            )
            .provideAsync("project-files", (event, args, completion) =>
                handler.projectFiles( event, files => completion(files))
            )
    }
}

/*

// IPC messages for welcome
export function bootstrap() {
    ipcMain.on('editor:open-project', openProject)
    ipcMain.on('editor:scan-project-files', scanProjectFiles)
    ipcMain.on('editor:build', runBuild)
    ipcMain.on('editor:open-simulator', callSimulator)
    ipcMain.on('editor:close', (event, path) => {
        ipcMain.emit("simulator:close", event, path)
        DockerInterface.accessForProject(path).stop()
        newEditor.close()
        newEditor = null
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


let newEditor:BrowserWindow

export function openProject(event:any, path:string) {

    newEditor = new BrowserWindow({
        minWidth: 500, minHeight: 400, 
        width:800, height:600,
        frame: false, resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (isDevelopment) {
        newEditor.loadURL("http://localhost:4200/?path=+" + encodeURIComponent(path))
        newEditor.webContents.openDevTools({mode: "detach"})
    } else newEditor.loadURL( formatUrl( {
        pathname: join(__dirname, "editor", 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    newEditor.on('close', () => {
        //console.log("editor is closing for " + path)
        //ipcMain.emit("editor:close", null, path)
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

*/