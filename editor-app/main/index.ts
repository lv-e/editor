import { app, BrowserWindow, ipcMain, dialog } from "electron"
import { presentWelcome } from "./welcome/welcome-main"

app.on('ready', () => {
    console.log("electron is ready")
    presentWelcome()
})

ipcMain.on('open-file', (event, data)  => {
    console.log('message received on main process')
    dialog.showOpenDialog(null,{
        title: "open project",
        properties: ["openFile"],
        filters:[{ name: "project", extensions:["lvproject"] }]
    }).then( (data) => {
        console.log("asd", data)
    })
})


