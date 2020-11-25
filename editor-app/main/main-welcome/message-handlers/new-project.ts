import * as std from "@lv-game-editor/lv-cli"
import { dialog } from "electron"
import { mkdirSync, writeFileSync } from "fs"
import { basename } from "path"

function projectTemplate() : std.projectContent {

    let encoders:std.encoder[] = [
        {
            extension: ".lvcode",
            npm_module: "@lv-game-editor/encoder-lvcode@\"<2.0.0\"",
            auto_update: false,
            commands: {
                encoder: "lv-encoder-lvcode",
                editor: "lv-editor-lvcode"
            }
        },
        {
            extension: ".lvproject",
            npm_module: "@lv-game-editor/encoder-lvproject@\"<2.0.0\"",
            auto_update: false,
            commands: {
                encoder: "lv-encoder-lvproject",
                editor: "lv-editor-lvproject"
            }
        }
    ]

    let drivers:std.driver[] = [
        {
            name: "simulator",
            docker_image: "lvedock/driver_simulator",
            cli_command: "sh /build.sh",
            current: true
        }
    ]

    return { 
        header: {
            version: "0.0.1",
            drivers: drivers,
            encoders: encoders
        },
        editor: {
            openedFiles: [],
            selectedFile: null
        }
    }
}

export function createNewProject(callback:(string?) => void){
    dialog.showSaveDialog(null, {
        buttonLabel: "Start project here",
        title: "Create new game",
        defaultPath: "MyGame",
        nameFieldLabel: "Game name",
        showsTagField: false
    }).then( (data:Electron.SaveDialogReturnValue) => {
        if (!data.canceled) {

            const gameName = basename(data.filePath)
            const template = JSON.stringify(projectTemplate(), null, "\t")
            const projectPath = `${data.filePath}/${gameName}.lvproject`

            const success = mkdirSync(data.filePath, {recursive: true})
            writeFileSync(projectPath, template)
            
            callback(projectPath)
        }
    })
}