import * as lv from '@lv-game-editor/lv-cli';

/*
type ProjectCallback = (files:lv.projectContent) => void

class ProjectWatcher {
    
    private listeners = new Array<ProjectCallback>()
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

let fsWatchers = new Map<string, ProjectWatcher>()
*/
export function project(path:string, callback:(project?:lv.projectContent) => void){
    
}