import { IpcMainEvent } from "electron"
import { readFileSync } from "fs"
import { EditorScreen } from "../editor-main"

export function readProjectFile(e:IpcMainEvent) : string {
    let path = EditorScreen.shared.pathForEvent(e)    
    return readFileSync(path, {encoding: "utf-8"})
}