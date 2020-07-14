import { BrowserWindow } from "electron";
import { ipc } from "../components/electron/ipcMain";
import { RecentFiles } from "../managers/recent-files";
import * as handler from "./message-handlers/index";

export class WelcomeScreen {

    // singleton access
    
    private static instance: WelcomeScreen;
    static get shared(): WelcomeScreen {
        if (!WelcomeScreen.instance) WelcomeScreen.instance = new WelcomeScreen();
        return WelcomeScreen.instance;
    }

    // current window managment

    private currentWindow:BrowserWindow | null = null
    private static getCurrentWindow() : BrowserWindow { return WelcomeScreen.shared.currentWindow }
    private static setCurrentWindow(newWindow:BrowserWindow) : BrowserWindow { 
        WelcomeScreen.shared.currentWindow = newWindow
        return newWindow
    }
    
    show()  { handler.show( WelcomeScreen.getCurrentWindow, WelcomeScreen.setCurrentWindow )}
    close() { handler.close( WelcomeScreen.getCurrentWindow, WelcomeScreen.setCurrentWindow ) }

    // ipc messages handling

    bootstrap() {
        
        ipc.welcome
            .on('show', this.show)
            .on('close', this.close)
            .on('choose-project', (_e, path) => 
                handler.chooseProject(path)
            )
            .provideAsync('open-project', (_args, completion) => 
                handler.openProject( path => completion(path))
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
}