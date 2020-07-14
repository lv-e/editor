import { BrowserWindow } from "electron"

export function close(
    getter:() => BrowserWindow,
    setter:(window:BrowserWindow) => BrowserWindow) {

    const welcomeWindow = getter() 
    if(welcomeWindow) welcomeWindow.close()
    setter(null)
    
}
