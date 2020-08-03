import * as React from "react";
import { SystemControl } from "./system-control";
import { SystemStatus } from "./system-status";
import { SystemRunner } from "./system-runner";

import "./system-bar.less"

export function SystemBar(){
    return  <div id="system-bar">
                <SystemControl/>
                <SystemStatus/>
                <SystemRunner/>
            </div>
}