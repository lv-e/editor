import * as React from "react";
import {SquareButton} from "[comps]/ui/square-button"
import {DriverSelector} from "./driver-selector"
import { ipc } from "[comps]/electron/ipcRenderer"

export function SystemRunner (props) {

    function callRun(){
        ipc.editor.send("run")
    }

    return  <div id="system-runner">
                <DriverSelector/>
                <SquareButton icon="play" onclick={ e => callRun()}/>
            </div>
}