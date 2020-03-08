import { BrowserWindow } from "electron"
import { isDevelopment } from ".."
import { join } from "path"
import { format as formatUrl } from 'url'

let simulators:Simulator[] = new Array<Simulator>()

export class Simulator {

    private path:string
    private window:BrowserWindow

    static forProject(path:string) : Simulator {

        for (const simulator of simulators) {
            if(simulator.path.trim() == path.trim())
                return simulator
        }

        const simulator = new Simulator(path)
        simulators.push(simulator)
        return simulator
    }

    private constructor(path:string){

        this.path = path

        this.window = new BrowserWindow({
            width:160+40, height:128+40,
            frame: false, resizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        })
    
        if (isDevelopment) {
            this.window.loadURL("http://localhost:4200/?path=+" + encodeURIComponent(path))
            
        } else this.window.loadURL( formatUrl( {
            pathname: join(__dirname, "simulator", 'index.html'),
            protocol: 'file',
            slashes: true
        }))
        
        this.window.show()
    }

    show() {
        this.window.show()
    }

    close(){
        simulators = simulators.filter( s => { return s != this })
        this.window.close()
    }
}