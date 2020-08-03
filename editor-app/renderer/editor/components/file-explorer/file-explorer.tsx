import * as React from "react";
import {SystemBar} from "./system-bar/system-bar"
import {Toolbar} from "./toolbar/toolbar"
import {Files} from "./files"

import "./file-explorer.less"

export function FileExplorer (props) {

    return  <div id="file-explorer">
                <SystemBar/>
                <Files/>
                <Toolbar/>
            </div>
}