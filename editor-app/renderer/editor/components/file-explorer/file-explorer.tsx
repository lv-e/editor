import * as React from "react";
import {SystemControl} from "./system-control"
import {SystemStatus} from "./system-status"
import {SystemRunner} from "./system-runner"

import "./file-explorer.less"
import {SquareButton} from "[comps]/ui/square-button"
import { ipc } from "[comps]/electron/ipcRenderer";

export function FileExplorer (props) {

    ipc.editor.fetch('project-files', e => {
        console.log(e)
    })

    return  <div id="system-bar">
                <SystemControl/>
                <SystemStatus/>
                <SystemRunner/>
            </div>
}