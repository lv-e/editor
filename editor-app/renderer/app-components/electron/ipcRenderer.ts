import { IpcRenderer } from "electron";

export type MainProcess = ("welcome"|"editor"|"simulator")

export class IPCRendererChannel {

    readonly mainProcess:MainProcess

    constructor(mainProcess:MainProcess){
        this.mainProcess = mainProcess
    }

    send(message:string, params?:any) {
        electronIPC().send(`${this.mainProcess}:${message}`, params)
    }

    atomicSend(message:string, params?:any) : any {
        return electronIPC().sendSync(`${this.mainProcess}:atomic-${message}`, params)
    }

    get(property:string, then:(data:any) => void) {
        try {
            electronIPC().once(`${this.mainProcess}:set-${property}`, (_event, args) => then(args))
            electronIPC().send(`${this.mainProcess}:get-${property}`)
        } catch (e) {
            console.error(e)
            then(null)
        }
    }

    fetch(property:string) : any {
        return electronIPC().sendSync(`${this.mainProcess}:fetch-${property}`)
    }

    bind(property:string, then:(data:any) => void) : () => void {

        const callback = (_event, args) => then(args)

        try {
            electronIPC().on(`${this.mainProcess}:set-${property}`, callback)
            electronIPC().send(`${this.mainProcess}:get-${property}`)
        } catch (e) {
            console.error(e)
            then(null)
        }

        const ipc = electronIPC()
        const bindName = `${this.mainProcess}:set-${property}` 

        function cleaner(){
            ipc.removeListener(bindName, callback)
        }
        
        return cleaner
    }
}

export var ipc = {
    get welcome(): IPCRendererChannel { return new IPCRendererChannel("welcome") },
    get editor(): IPCRendererChannel { return new IPCRendererChannel("editor") },
    get simulator(): IPCRendererChannel { return new IPCRendererChannel("simulator") }
}

function electronIPC() : IpcRenderer {
    const electron = window.require('electron');
    return electron.ipcRenderer;
}

