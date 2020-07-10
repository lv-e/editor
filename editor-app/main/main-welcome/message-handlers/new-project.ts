import { dialog } from "electron"

export function createNewProject(callback:(string?) => void){
    dialog.showSaveDialog(null, {
        buttonLabel: "Start project here",
        title: "Create new game",
        defaultPath: "MyGame",
        nameFieldLabel: "Game name",
        showsTagField: false
    }).then( (data:Electron.SaveDialogReturnValue) => {
        if (!data.canceled) {
            callback(data.filePath)
        }
    })
}