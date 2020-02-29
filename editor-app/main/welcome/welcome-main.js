"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
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
exports.presentWelcome = presentWelcome;
