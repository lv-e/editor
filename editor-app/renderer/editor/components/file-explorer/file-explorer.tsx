import * as React from "react";
import {SystemControl} from "./system-control"
import {SystemStatus} from "./system-status"
import {SystemRunner} from "./system-runner"
import {Files} from "./files"

import "./file-explorer.less"

export function FileExplorer (props) {

    return  <div id="file-explorer">
                <div id="system-bar">
                    <SystemControl/>
                    <SystemStatus/>
                    <SystemRunner/>
                </div>
                <div id="files">
                    <Files/>
                </div>        
            </div>
}