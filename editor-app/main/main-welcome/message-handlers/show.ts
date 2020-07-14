
import { BrowserWindow } from "electron";
import { join } from "path";
import { format } from 'url';
import { isDevelopment } from "../..";

export function show(
    getter:() => BrowserWindow,
    setter:(window:BrowserWindow) => BrowserWindow) {

    let welcomeWindow = getter()
    
    if (welcomeWindow == null) {

        welcomeWindow = setter(
            new BrowserWindow({
                width:600, height:400,
                frame: false, resizable: false,
                webPreferences: {
                    nodeIntegration: true
                }
            })
        )
        
        if (isDevelopment) 
            welcomeWindow.loadURL("http://localhost:4100/")
        else welcomeWindow.loadURL( format( {
            pathname: join(__dirname, "welcome", 'index.html'),
            protocol: 'file',
            slashes: true
        }))
        
        welcomeWindow.show()
    }

    welcomeWindow.focus()
}