import { BrowserWindow } from "electron"

export function presentWelcome() {
    let window = new BrowserWindow({
        width:600,
        height:400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadURL("http://localhost:4100/")
    window.show()
}