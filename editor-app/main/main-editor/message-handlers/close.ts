import { IpcMainEvent } from "electron";
import { ipc } from "../../components/electron/ipcMain";
import { EditorScreen } from "../editor-main";

export function close(e:IpcMainEvent){
    let window = EditorScreen.shared.windowForEvent(e)
    let path   = EditorScreen.shared.pathForEvent(e)
    ipc.editor.emit("before-close", path)
    window.close()
}