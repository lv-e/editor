import { BrowserWindow } from "electron";
import { join } from "path";
import { format } from 'url';
import { isDevelopment } from "../..";

export function openProject(path:string) : BrowserWindow{

    let window = new BrowserWindow({
        minWidth: 500, minHeight: 400, 
        width:800, height:600,
        frame: false, resizable: true,
        webPreferences: { nodeIntegration: true}
    })

    if (isDevelopment) {
        window.loadURL("http://localhost:4200/?path=+" + encodeURIComponent(path))
        window.webContents.openDevTools({mode: "detach"})
    } else window.loadURL( format( {
        pathname: join(__dirname, "editor", 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    window.once('ready-to-show', () => window.show())

    return window
}