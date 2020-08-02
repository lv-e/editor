import * as lv from "@lv-game-editor/lv-cli";
import { ipc } from "./ipcRenderer";

export class Project {

    static get current() : lv.projectContent {
        const rawJSON = ipc.editor.fetch("read-project")
        return JSON.parse(rawJSON)  
    }

    static save(content:lv.projectContent) : boolean {
        return ipc.editor.atomicSend("save-project", content)
    }

    static bind(callback:(content:lv.projectContent) => void) {
        ipc.editor.bind("project", content => callback(content))
    }

    static edit(callback:(content:lv.projectContent) => lv.projectContent) : boolean {
        const newProject = callback(Project.current)
        return Project.save(newProject)
    }
}