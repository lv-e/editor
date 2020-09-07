import * as lv from '@lv-game-editor/lv-cli';
import { IpcMainEvent } from 'electron';
import { FSWatcher, readFileSync, watch } from 'fs';
import { parse } from 'path';
import { EditorScreen } from '../editor-main';

type ProjectCallback = (files:lv.projectContent) => void

class ProjectWatcher {
    
    private listeners = new Array<ProjectCallback>()
    constructor(readonly path:string, readonly watcher:FSWatcher) {
        console.log(`new project watcher started at: ${path}`)
    }

    triggerChange() {
        const data = this.readProjectFile(this.path)
        this.listeners.forEach( l => l(data))
    }

    addListener(listener:ProjectCallback) {
        this.listeners.push(listener)
    }

    private readProjectFile(path:string) : lv.projectContent {
        let rawJSON = readFileSync(path, {encoding: "utf-8"})
        let content:lv.projectContent = JSON.parse(rawJSON)
        return content
    }
}

let fsWatchers = new Map<string, ProjectWatcher>()

export function projectChanges(e:IpcMainEvent, callback:(project?:lv.projectContent) => void){

    let path   = EditorScreen.shared.pathForEvent(e)
    let cached = fsWatchers.get(path)

    if (cached != null) {
        cached.addListener(callback)
        cached.triggerChange()
        
    } else {

        const watcher = watch(path, {
            persistent: true,
            recursive: true,
            encoding: 'buffer'
        })
        
        let project = new ProjectWatcher(path, watcher)
        project.addListener(callback)
        fsWatchers.set(path, project)

        watcher.on("change", (eventType?, file?) => {
            if (!eventType || !file) return;
            if (eventType != "change") return
            if (parse(`${file}`).ext != ".lvproject") return
            project.triggerChange()
        })

        project.triggerChange()
    }
}