import { app, BrowserWindow, ipcMain, dialog } from "electron"
import * as WelcomeMain from './main-welcome/welcome-main'
export const isDevelopment = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
    console.log("[lv editor] electron is ready ⚡️")
    console.log("current env is " + (isDevelopment ? "dev" : "prod"))

    WelcomeMain.bootstrap()

    ipcMain.emit("welcome:show")
})