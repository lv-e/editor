import { ipcMain } from "electron"
import { Simulator } from "./simulator-interface"

// IPC messages for simulator
export function bootstrap() {
    ipcMain.on('simulator:close', (event, path) => {
        const sim = Simulator.forProject(path)
        sim.close()
    })
}

export function openSimulator(path:string) {
    const sim = Simulator.forProject(path)
    sim.show()
}