"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const dockerode_ts_1 = __importDefault(require("dockerode-ts"));
let docker = new dockerode_ts_1.default();
function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
electron_1.app.on('ready', () => {
    bootstrapCLIContainer(container => {
        container.exec({ Cmd: ["lv-cli", "help"], AttachStdin: true, AttachStdout: true }, (err, command) => {
            command.start({}, (error, data) => {
                streamToString(data).then((str) => {
                    console.log("--" + str + "--");
                });
            });
        });
    });
});
function bootstrapCLIContainer(callback) {
    docker.createContainer({
        Image: 'lvedock/lve_runtime',
        Tty: true,
        AttachStdout: true,
    }, (error, container) => {
        if (container != undefined) {
            container.start((error, data) => {
                if (error == null)
                    callback(container);
                else
                    console.error("Can't start cli container! reason: ", error);
            });
        }
        else {
            console.error("can't load cli container. reason: ", error);
        }
    });
}
