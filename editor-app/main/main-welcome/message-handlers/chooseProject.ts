import { dialog } from "electron"
import { openProject } from "../../main-editor/editor-main"
import { FileEntry, RecentFiles } from "../../managers/recent-files"
import { WelcomeScreen } from "../welcome-main"

export function chooseProject(path){
    const project = new FileEntry(path)
    if (project.exists) {
        
        RecentFiles.shared().add(project)
        openProject(null, project.filepath)
        WelcomeScreen.shared.close()
        
    } else {
        dialog.showMessageBox(null, {
            message:"Ops",
            detail:`Can't open project at ${path}.`
        })
    }
}