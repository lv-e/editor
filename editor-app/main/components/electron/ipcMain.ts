import { ipcMain, IpcMainEvent } from "electron"

export type MainProcess = ("welcome"|"editor"|"simulator")

export class IPCMainChannel {

    readonly mainProcess:MainProcess

    constructor(mainProcess:MainProcess){
        this.mainProcess = mainProcess
    }

    provideSync(property:any, source:(event:IpcMainEvent, params:any) => any) : this {
        ipcMain.on(`${this.mainProcess}:fetch-${property}`, (e, args) => {
            const value = source(e, args)
            e.returnValue = value
        })
        return this
    }

    provideAsync(property:any, source:(event:IpcMainEvent, params:any, completion:(any) => void) => any) : this {
        ipcMain.on(`${this.mainProcess}:get-${property}`, (e, args) => {
            source(e, args, value => {
                e.reply(`${this.mainProcess}:set-${property}`, value)
            })
        })

        return this
    }

    on(message: string, listener: (event: IpcMainEvent, arg: any) => void) : this {
        ipcMain.on(`${this.mainProcess}:${message}`, (event, args) => {
            listener(event, args)
        })
        return this
    }

    atomic(message: string, listener: (event: IpcMainEvent, arg: any) => any) : this {
        ipcMain.on(`${this.mainProcess}:atomic-${message}`, (event, args) => {
            event.returnValue = listener(event, args)
        })
        return this
    }

    once(message: string, listener: (event: IpcMainEvent, arg: any) => void) : this {
        ipcMain.once(`${this.mainProcess}:${message}`, (event, args) => {
            listener(event, args)
        })
        return this
    }
    
    emit(message: string, ...args:any) {
        ipcMain.emit(`${this.mainProcess}:${message}`, undefined, ...args)
    }

}

export var ipc = {
    get welcome(): IPCMainChannel { return new IPCMainChannel("welcome") },
    get editor(): IPCMainChannel { return new IPCMainChannel("editor") },
    get simulator(): IPCMainChannel { return new IPCMainChannel("simulator") }
}
