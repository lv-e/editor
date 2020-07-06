import { app, ipcMain } from 'electron';

import * as EditorMain from './main-editor/editor-main';
import * as SimulatorMain from './main-simulator/simulator-main';
import * as WelcomeMain from './main-welcome/welcome-main';

export const isDevelopment = process.env.NODE_ENV !== 'production'

app.allowRendererProcessReuse = true

app.on('ready', () => {

    console.log("[lv editor] electron is ready ⚡️")
    console.log("current env is " + (isDevelopment ? "dev" : "prod"))

    WelcomeMain.bootstrap()
    EditorMain.bootstrap()
    SimulatorMain.bootstrap()

    ipcMain.emit("welcome:show")
})

app.on('window-all-closed', () => {
    app.quit()
})