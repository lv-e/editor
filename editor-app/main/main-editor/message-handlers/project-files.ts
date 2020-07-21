import * as cli from '@lv-game-editor/lv-cli';
import { watch } from 'fs';
import { basename } from "path";
import { ipc } from '../../components/electron/ipcMain';
import { DockerInterface } from "../docker-interface";

export function projectFiles(path:string, callback:(string?) => void){
    let access = DockerInterface.accessForProject(path)
    access.withContainer( () =>{

        const watcher = watch(access.dir(), {
            persistent: true
        })

        watcher
            .on('add', scan).on('unlink', scan)
            .on('addDir', scan).on('unlinkDir', scan)
    
        function scan(file?:string){
            if (file != null && basename(file).startsWith(".")) return
            if (file != null && file.includes(".shared/")) return
            if (file != null && file.includes(".bin/")) return
            DockerInterface.accessForProject(path).scan(
                (data:cli.rootFolders) => callback(data)
            )
        }

        ipc.editor.once('before-close', (_e, eventPath) => {
            if(eventPath.trim() != path.trim()) return
            watcher.removeAllListeners()
            console.log(`did stop watching files for ${eventPath}`)
        })

        scan()
    })
}