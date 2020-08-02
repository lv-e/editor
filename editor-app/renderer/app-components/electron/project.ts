import * as lv from "@lv-game-editor/lv-cli";
import { ipc } from "./ipcRenderer";

export class Project {

    static readonly current:lv.projectContent = function() {
        console.log("reading project!!!!")
        const rawJSON = ipc.editor.fetch("read-project")
        return JSON.parse(rawJSON)  
    }()

    static save(content:lv.projectContent) {
        ipc.editor.send("save-project", content)
    }

    static bind(callback:(content:lv.projectContent) => void) {
        ipc.editor.bind("project", content => callback(content))
    }

    static edit(callback:(content:lv.projectContent) => lv.projectContent) {
        ipc.editor.get("project", content => {
            let newContent = callback(content)
            Project.save(newContent)
        })
    }
}