

export function ipc(message:string){
    const electron = window.require('electron');
    const ipcRenderer  = electron.ipcRenderer;
    ipcRenderer.send(message)
}