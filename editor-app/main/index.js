"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
electron_1.app.on('ready', function () {
    console.log("electron is ready");
    presentWelcome();
});
electron_1.ipcMain.on('open-file', function (event, data) {
    console.log('message received on main process');
    electron_1.dialog.showOpenDialog(null, {}).then(function () {
        console.log("asd");
    });
});
function presentWelcome() {
    var window = new electron_1.BrowserWindow({
        width: 600,
        height: 400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadURL("http://localhost:4100/");
    window.show();
}
