import * as React from "react";
import {SystemControl} from "./system-control"
import {SystemStatus} from "./system-status"

import "./file-explorer.less"
import {SquareButton} from "[comps]/ui/square-button"

export function FileExplorer (props) {
    return  <div id="system-bar">
                <SystemControl/>
                <SystemStatus/>
                <SquareButton icon="play" onclick={ e => console.log(e)}/>
            </div>
}