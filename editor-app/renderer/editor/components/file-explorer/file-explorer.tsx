import * as React from "react";
import {SystemControl} from "./system-control"
import {SystemStatus} from "./system-status"
import {SystemRunner} from "./system-runner"

import "./file-explorer.less"
import {SquareButton} from "[comps]/ui/square-button"

export function FileExplorer (props) {
    return  <div id="system-bar">
                <SystemControl/>
                <SystemStatus/>
                <SystemRunner/>
            </div>
}