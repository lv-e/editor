import { IpcMainEvent } from "electron";
import { EditorScreen } from "../editor-main";

export function editFile(e:IpcMainEvent, file:string){
    let window = EditorScreen.shared.windowForEvent(e)
    let path   = EditorScreen.shared.pathForEvent(e)
    console.log(file)
}