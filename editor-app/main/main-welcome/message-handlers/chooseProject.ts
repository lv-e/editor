import { dialog } from "electron"
import { ipc } from "../../components/electron/ipcMain"
import { FileEntry, RecentFiles } from "../../managers/recent-files"

export function chooseProject(path){
    const project = new FileEntry(path)
    if (project.exists) {
        
        RecentFiles.shared().add(project)
        ipc.editor.emit("open-project", project.filepath)
        ipc.welcome.emit("close")
        
    } else {
        dialog.showMessageBox(null, {
            message:"Ops",
            detail:`Can't open project at ${path}.`
        })
    }
}