import * as React from "react";
import {SquareButton} from "[comps]/ui/square-button"
import { ipc } from "[comps]/electron/ipcRenderer"

export function SystemRunner (props) {

    function doMagic(){
        ipc.editor.send("run")
    }

    return  <div id="system-runner">
                <SquareButton icon="play" onclick={ e => doMagic()}/>
            </div>
}