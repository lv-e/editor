"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var welcome_main_1 = require("./welcome/welcome-main");
electron_1.app.on('ready', function () {
    console.log("electron is ready");
    welcome_main_1.presentWelcome();
});
electron_1.ipcMain.on('open-file', function (event, data) {
    console.log('message received on main process');
    electron_1.dialog.showOpenDialog(null, {
        title: "open project",
        properties: ["openFile"],
        filters: [{ name: "project", extensions: ["lvproject"] }]
    }).then(function (data) {
        console.log("asd", data);
    });
});
