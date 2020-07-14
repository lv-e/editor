import { setWelcomeWindow, welcomeWindow } from "../welcome-main"

export function close() {
    if(welcomeWindow) welcomeWindow.close()
    setWelcomeWindow(null)
}
