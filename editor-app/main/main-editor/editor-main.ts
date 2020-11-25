import { BrowserWindow, IpcMainEvent } from "electron";
import { ipc } from "../components/electron/ipcMain";
import * as handler from "./message-handlers/index";

export type Editor = {path:string, browserWindow:BrowserWindow}

export class EditorScreen {

    // singleton access
    private static instance: EditorScreen;
    static get shared(): EditorScreen {
        if (!EditorScreen.instance) EditorScreen.instance = new EditorScreen();
        return EditorScreen.instance;
    }

    // current window managment 
    private editorWindows:Editor[] = []

    pathForEvent(e:IpcMainEvent) : (string | null) {
        let window = this.windowForEvent(e)
        return this.editorWindows.find( edt => edt.browserWindow.id == window.id).path
    }

    windowForEvent(e:IpcMainEvent) : (BrowserWindow | null) {
        return BrowserWindow.fromWebContents(e.sender)
    }
    
    // ipc messages handling
    bootstrap() {
        ipc.editor
            .on('open-project', (_e, path) =>
                this.editorWindows.push({
                    path: path, browserWindow: handler.openProject(path)
                })
            )
            .on('close', e => 
                handler.close(e)
            )
            .on('run', e => 
                handler.run(e)
            )
            .on('edit-file', (e, file) => 
                handler.editFile(e, file)
            )
            .atomic('save-project', (e, data) => 
                handler.saveProject(e, data)
            )
            .provideSync("read-project", event => {
                return handler.readProjectFile(event)
            })
            .provideAsync("project-changes", (event, args, completion) =>
                handler.projectChanges( event, project => completion(project))
            )
            .provideAsync("docker-log", (event, args, completion) =>
                handler.dockerLogChanges( event, project => completion(project))
            )
            .provideAsync("project-files", (event, args, completion) =>
                handler.projectFiles( event, files => completion(files))
            )
    }
}
