import * as React from "react";
import { ipc } from "[comps]/electron/ipcRenderer"
import {MiniButton} from "../../../app-components/ui/mini-button"

import "./file-explorer.less"

export function SystemStatus (props) {
    return  <section id="system-status">
                <p>waiting docker</p>
            </section>
}