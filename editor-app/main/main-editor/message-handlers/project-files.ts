import * as cli from '@lv-game-editor/lv-cli';
import { FSWatcher, watch } from 'fs';
import { parse } from 'path';
import { ipc } from '../../components/electron/ipcMain';
import { DockerInterface } from "../docker-interface";

let watcher:FSWatcher

export function projectFiles(path:string, callback:(string?) => void){
    let access = DockerInterface.accessForProject(path)
    access.withContainer( () =>{

        watcher = watch(access.dir(), {
            persistent: true,
            recursive: true,
            encoding: 'buffer'
        })

        watcher.on("change", (eventType?, file?) => {

            if (!eventType || !file) return;
            
            const fileData = parse(`${file}`)
            if (fileData.base.startsWith(".")) return
            if (file.includes(".shared/")) return
            if (file.includes(".bin/")) return
            
            DockerInterface.accessForProject(path).scan(
                (data:cli.rootFolders) => callback(data)
            )
        })

        ipc.editor.once('before-close', (_e, eventPath) => {
            if(!path || !eventPath || eventPath.trim() != path.trim()) return
            watcher.removeAllListeners()
            console.log(`did stop watching files for ${path}`)
        })

        DockerInterface.accessForProject(path).scan(
            (data:cli.rootFolders) => callback(data)
        )
    })
}