import { IpcMainEvent } from 'electron';
import { existsSync, FSWatcher, readFileSync, watch, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { EditorScreen } from '../editor-main';

type LoggerCallback = (lines:string[]) => void

class DockerLoggerWatcher {
    
    private listeners = new Array<LoggerCallback>()

    constructor(readonly path:string, readonly watcher:FSWatcher) {
        console.log(`new log watcher started at: ${path}`)
    }

    triggerChange() {
        const lines = readFileSync(this.path).toString().split("\n");
        this.listeners.forEach( l => l(lines))
    }

    addListener(listener:LoggerCallback) {
        this.listeners.push(listener)
    }
}

let fsWatchers = new Map<string, DockerLoggerWatcher>()

export function dockerLogChanges(e:IpcMainEvent, callback:(lines?:string[]) => void){

    let path   = EditorScreen.shared.pathForEvent(e)
    let cached = fsWatchers.get(path)

    if (cached != null) {
        cached.addListener(callback)
        cached.triggerChange()
        
    } else {

        let dir = dirname(path)
        let logLocation = join(dir, ".shared", "log.txt")

        if (!existsSync(logLocation)) {
            console.log("log.txt missing, creating a new one")
            writeFileSync(logLocation, "")
        }

        const watcher = watch( logLocation, {
            persistent: true,
            encoding: 'buffer'
        })
        
        let dockerLogger = new DockerLoggerWatcher(logLocation, watcher)
        dockerLogger.addListener(callback)
        fsWatchers.set(path, dockerLogger)

        watcher.on("change", (eventType?, file?) => {
            if (!eventType || !file) return;
            if (eventType != "change") return
            dockerLogger.triggerChange()
        })

        dockerLogger.triggerChange()
    }
}