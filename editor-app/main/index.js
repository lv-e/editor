"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
electron_1.app.on('ready', function () {
    console.log("electron is ready");
    presentWelcome();
});
function presentWelcome() {
    var window = new electron_1.BrowserWindow({ width: 600, height: 400, frame: false, resizable: false });
    window.loadURL("http://localhost:4100/");
    window.show();
}
