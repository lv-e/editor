
import * as Electron from "electron";
import { dialog } from "electron";

export function openProject(callback:(string?) => void){

    // show an open file dialog
    dialog.showOpenDialog( null, {
        title: "open project", 
        properties: ["openFile"],
        filters:[{ name: "project", extensions:["lvproject"] }]
        
    }).then( (data:Electron.OpenDialogReturnValue) => {
        if (!data.canceled) {
            const choosenPath = data.filePaths[0]
            callback(choosenPath)
        }
    })
}