import { IpcRenderer } from "electron";

export type MainProcess = ("welcome"|"editor"|"simulator")

export class IPCChannel {

    readonly mainProcess:MainProcess

    constructor(mainProcess:MainProcess){
        this.mainProcess = mainProcess
    }

    send(message:string, params?:any) {
        electronIPC().send(`${this.mainProcess}:${message}`, params)
    }

    fetch(property:string, then:(data:any) => void) {
        try {
            electronIPC().once(`${this.mainProcess}:set-${property}`, (_event, args) => then(args))
            electronIPC().send(`${this.mainProcess}:get-${property}`)
        } catch (e) {
            console.error(e)
            then(null)
        }
    }
}

export var ipc = {
    get welcome(): IPCChannel { return new IPCChannel("welcome") },
    get editor(): IPCChannel { return new IPCChannel("editor") },
    get simulator(): IPCChannel { return new IPCChannel("simulator") }
}

function electronIPC() : IpcRenderer {
    const electron = window.require('electron');
    return electron.ipcRenderer;
}

