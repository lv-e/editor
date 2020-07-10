
import * as Electron from "electron";
import { dialog } from "electron";
import { FileEntry, RecentFiles } from "../../managers/recent-files";

export function openProject(event:Electron.IpcMainEvent){

    // show an open file dialog
    dialog.showOpenDialog( null, {
        title: "open project", 
        properties: ["openFile"],
        filters:[{ name: "project", extensions:["lvproject"] }]
        
    }).then( (data:Electron.OpenDialogReturnValue) => {
        if (!data.canceled) {
            const choosenPath = data.filePaths[0]
            const choosenFile = new FileEntry(choosenPath)
            RecentFiles.shared().add(choosenFile)
        }
    })
}