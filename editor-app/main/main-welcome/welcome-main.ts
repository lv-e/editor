import { BrowserWindow } from "electron";
import { ipc } from "../components/electron/ipcMain";
import { RecentFiles } from "../managers/recent-files";
import * as handler from "./message-handlers";

export let welcomeWindow:BrowserWindow | null = null
export function setWelcomeWindow(w:BrowserWindow) { welcomeWindow = w }

export function bootstrap() {

    ipc.welcome
        .on('show', handler.show)
        .on('close', handler.close)
        .on('choose-project', (_e, path) => 
            handler.chooseProject(path)
        )
        .provideAsync('open-project', (_args, completion) => 
            handler.openProject(path => completion(path))
        )
        .provideAsync("new-project", (_args, completion) => 
            handler.createNewProject( file => completion(file))
        )
        .provideAsync('news', (_args, completion) => 
            handler.fetchNews( news => completion(news))
        )
        .provideSync("recent-projects",  _e => 
            RecentFiles.shared().getAll
        )
}
