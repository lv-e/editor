import * as React from "react";
import "./file-explorer.less"
import {SquareButton} from "[comps]/ui/square-button"

export function SystemRunner (props) {
    return  <div id="system-runner">
                <SquareButton icon="play" onclick={ e => console.log(e)}/>
            </div>
}