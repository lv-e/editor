import { IpcRenderer } from "electron";

export function ipc() : IpcRenderer {
    const electron = window.require('electron');
    return electron.ipcRenderer;
}

export type availableWindows = ("welcome"|"editor"|"simulator")
export function fetch(context:availableWindows, property:string, then:(data:any) => void){    
    try {
        ipc().once(`${context}:set-${property}`, (_event, args) => then(args))
        ipc().send(`${context}:get-${property}`)
    } catch (e) {
        console.error(e)
        then(null)
    }
}


