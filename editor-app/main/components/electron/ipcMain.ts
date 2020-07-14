import { ipcMain, IpcMainEvent } from "electron"

export type MainProcess = ("welcome"|"editor"|"simulator")

export class IPCMainChannel {

    readonly mainProcess:MainProcess

    constructor(mainProcess:MainProcess){
        this.mainProcess = mainProcess
    }

    provideSync(property:any, source:(params:any) => any) : this {
        ipcMain.on(`${this.mainProcess}:get-${property}`, (e, args) => {
            const value = source(args)
            e.reply(`${this.mainProcess}:set-${property}`, value)
        })

        return this
    }

    provideAsync(property:any, source:(params:any, completion:(any) => void) => any) : this {
        ipcMain.on(`${this.mainProcess}:get-${property}`, (e, args) => {
            source(args, value => {
                e.reply(`${this.mainProcess}:set-${property}`, value)
            })
        })

        return this
    }

    on(message: string, listener: (event: IpcMainEvent, ...args: any[]) => void) : this {
        ipcMain.on(`${this.mainProcess}:${message}`, listener)
        return this
    }

    send(message: string) {
        ipcMain.handle(message, () => {})
    }

}

export var ipc = {
    get welcome(): IPCMainChannel { return new IPCMainChannel("welcome") },
    get editor(): IPCMainChannel { return new IPCMainChannel("editor") },
    get simulator(): IPCMainChannel { return new IPCMainChannel("simulator") }
}
