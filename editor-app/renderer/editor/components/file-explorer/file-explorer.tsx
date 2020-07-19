import * as React from "react";
import {SystemControl} from "./system-control"
import {SystemStatus} from "./system-status"

import "./file-explorer.less"

export function FileExplorer (props) {
    return  <div id="system-bar">
                <SystemControl/>
                <SystemStatus/>
            </div>
}