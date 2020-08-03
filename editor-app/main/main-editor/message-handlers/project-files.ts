import * as lv from '@lv-game-editor/lv-cli';
import * as chokidar from "chokidar";
import { debounce } from 'debounce';
import { IpcMainEvent } from 'electron';
import { FSWatcher } from 'fs';
import { dirname } from 'path';
import { ipc } from '../../components/electron/ipcMain';
import { DockerInterface } from "../docker-interface";
import { EditorScreen } from '../editor-main';

export type FilesCallback = (files:lv.rootFolders) => void
let fsWatchers = new Map<string, FilesWatcher>()

class FilesWatcher {
    
    private listeners = new Array<FilesCallback>()
    private watcher:FSWatcher
    private debouncedScan:(() => void) 

    constructor(readonly path:string) {

        this.debouncedScan = debounce(this.scan, 10, false)

        let dir = dirname(this.path).trim()
        console.log(`new project files watcher started at: ${dir}`)
        
        this.watcher = chokidar.watch(dir, {
            persistent: true,
            ignoreInitial: true,
            followSymlinks: false,
            ignored: /(^|[\/\\])\../
        })

        this.watcher.on("all", (eventType, file) => {
            if (!eventType || eventType == "change") return
            console.log("calling scan " + eventType + " // " + file)
            this.debouncedScan()
        })
        
        ipc.editor.once('before-close', (_e, eventPath) => {
            if(!path || !eventPath || eventPath.trim() != path.trim()) return
            this.watcher.removeAllListeners()
            fsWatchers.delete(path)
            console.log(`did stop watching files for ${path}`)
        })

        this.triggerScan()
    }

    triggerScan() { this.debouncedScan() }
    private scan() {
        let docker = DockerInterface.accessForProject(this.path)
        docker.scan( (files:lv.rootFolders) => {
            this.listeners.forEach( l => l(files))
        })
    }

    addListener(listener:FilesCallback) {
        this.listeners.push(listener)
    }
}

export function projectFiles(e:IpcMainEvent, callback:(root?:lv.rootFolders) => void){

    let path   = EditorScreen.shared.pathForEvent(e)
    let cached = fsWatchers.get(path)
    
    if (cached != null) {

        console.log("[project files] fsWatcher found cached")
        
        cached.addListener(callback)
        cached.triggerScan()

    } else {
        
        console.log("[project files] fsWatcher cache miss")

        let project = new FilesWatcher(path)
        project.addListener(callback)
        fsWatchers.set(path, project)
    }
}