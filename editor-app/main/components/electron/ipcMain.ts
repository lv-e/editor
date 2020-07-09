import { ipcMain } from "electron"

export type MainProcess = ("welcome"|"editor"|"simulator")

export class IPCMainChannel {

    readonly mainProcess:MainProcess

    constructor(mainProcess:MainProcess){
        this.mainProcess = mainProcess
    }

    provide(property:any, source:(params:any) => any) {
        ipcMain.on(`${this.mainProcess}:get-${property}`, (e, args) => {
            const value = source(args)
            e.reply(`${this.mainProcess}:set-${property}`, value)
        })
    }

}

export var ipc = {
    get welcome(): IPCMainChannel { return new IPCMainChannel("welcome") },
    get editor(): IPCMainChannel { return new IPCMainChannel("editor") },
    get simulator(): IPCMainChannel { return new IPCMainChannel("simulator") }
}
