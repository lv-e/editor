import * as lv from '@lv-game-editor/lv-cli';
import { IpcMainEvent } from 'electron';
import { FSWatcher, watch } from 'fs';
import { parse } from 'path';
import { ipc } from '../../components/electron/ipcMain';
import { DockerInterface } from "../docker-interface";
import { EditorScreen } from '../editor-main';

type FilesCallback = (files:lv.rootFolders) => void

class FilesWatcher {
    
    private listeners = new Array<FilesCallback>()
    constructor(readonly path:string, readonly watcher:FSWatcher) {
        console.log(`new project files watcher started at: ${path}`)
    }

    triggerChange(files:lv.rootFolders) {
        this.listeners.forEach( l => l(files))
    }

    addListener(listener:FilesCallback) {
        this.listeners.push(listener)
    }
}

let fsWatchers = new Map<string, FilesWatcher>()

export function projectFiles(e:IpcMainEvent, callback:(root?:lv.rootFolders) => void){

    let path   = EditorScreen.shared.pathForEvent(e)
    let docker = DockerInterface.accessForProject(path)

    let cached = fsWatchers.get(path)
    if (cached != null) {
        console.log("fsWatchers found cached")
        cached.addListener(callback)

    } else {

        console.log("fsWatchers cache miss")
        
        const watcher = watch(docker.dir(), {
            persistent: true,
            recursive: true,
            encoding: 'buffer'
        })
        
        let project = new FilesWatcher(path, watcher)
        project.addListener(callback)
        fsWatchers.set(path, project)

        docker.withContainer( () =>{

            // change watcher:
            watcher.on("change", (eventType?, file?) => {
    
                if (!eventType || !file) return
                if (eventType == "change") return

                const fileData = parse(`${file}`)
                if (fileData.base.startsWith(".")) return

                if (file.includes(".shared/")) return
                if (file.includes(".bin/")) return
                
                docker.scan( (data:lv.rootFolders) => project.triggerChange(data))
            })
    
            // listeners cleanup:
            ipc.editor.once('before-close', (_e, eventPath) => {
                if(!path || !eventPath || eventPath.trim() != path.trim()) return
                watcher.removeAllListeners()
                fsWatchers.delete(path)
                
                console.log(`did stop watching files for ${path}`)
            })
            
            // first time scan:
            docker.scan( (data:lv.rootFolders) => project.triggerChange(data))
        })
    }
}