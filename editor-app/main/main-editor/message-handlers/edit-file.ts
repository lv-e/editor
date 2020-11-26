import { projectContent } from '@lv-game-editor/lv-cli';
import { Buffer } from 'buffer';
import { IpcMainEvent } from "electron";
import { request } from "http";
import { extname } from "path";
import { DockerInterface } from "../docker-interface";
import { EditorScreen } from "../editor-main";
import { readProjectFile } from './read-project';

let editors = Array<{port:number, extension:string}>()

export function editorURL(e:IpcMainEvent) : (string|null) {

    const rawJSON = readProjectFile(e)
    const project:projectContent = JSON.parse(rawJSON)
    const selected = project.editor.selectedFile

    const extension = extname(selected)
    let port:number = undefined

    editors.forEach( e => { if(e.extension == extension) port = e.port })
    if (port == undefined) return null
    
    const file64 = Buffer.from(selected).toString('base64')
    return `http://127.0.0.01:${port}/?file=${file64}`
}

export function editFile(e:IpcMainEvent, file:string){

    let path    = EditorScreen.shared.pathForEvent(e)
    let docker  = DockerInterface.accessForProject(path)
    
    let extension = extname(file)

    let port:number = undefined
    let highPort = 3099
    
    editors.forEach( e => {
        if(e.port > highPort) highPort = e.port
        if(e.extension == extension) port = e.port
    })

    if (port == undefined) {
        port = highPort + 1
        editors.push({port, extension})
    }

    const options = {method: 'HEAD', host: '127.0.0.1', port: port, path: '/'};
    const probe = request(options, response => {
        console.log(`editor for ${extension} running on port ${port}`)  
    });

    probe.on('error', e => {
        if (e.message.includes("socket hang up")) {
            docker.edit(`${port}`, file, (success) => {
                if (success) {
                    console.log(`editor for ${extension} created at port ${port}`)  
                } else {
                    console.log(`editor for ${extension} just got an error on port ${port}`)  
                }
            })
        } else {
            console.log(e.message)
        }
    })

    probe.end();
}