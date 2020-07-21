import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { ipc } from './components/electron/ipcMain';
import { EditorScreen } from './main-editor/editor-main';
import * as SimulatorMain from './main-simulator/simulator-main';
import { WelcomeScreen } from './main-welcome/welcome-main';

export const isDevelopment = process.env.NODE_ENV !== 'production'

app.allowRendererProcessReuse = true

app.on('ready', () => {

    console.log("[lv editor] electron is ready ⚡️")
    console.log("current env is " + (isDevelopment ? "dev" : "prod"))

    WelcomeScreen.shared.bootstrap()
    EditorScreen.shared.bootstrap()
    SimulatorMain.bootstrap()

    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'lvndr',
            submenu: ([
                { role: 'about' },
                { role: 'toggleDevTools' }
            ] as MenuItemConstructorOptions[])
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    
    ipc.welcome.emit("show")
})

app.on('window-all-closed', () => {
    app.quit()
})