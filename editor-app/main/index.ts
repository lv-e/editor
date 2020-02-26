import {app, BrowserWindow} from "electron"

app.on('ready', () => {
    console.log("electron is ready")
    presentWelcome()
})

function presentWelcome() {
    let window = new BrowserWindow({width:600, height:400, frame: false, resizable: false})
    window.loadURL("http://localhost:4100/")
    window.show()
}
