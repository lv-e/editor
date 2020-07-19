import * as React from "react";
import { ipc } from "[comps]/electron/ipcRenderer"
import {MiniButton} from "../../../app-components/ui/mini-button"

import "./file-explorer.less"

export function SystemControl (props) {

    const logo = require('[assets]/images/bg/header-logo-bg.png');
    
    return  <section id="system-control">
                <MiniButton icon="close" onclick={ e => ipc.editor.send("close") }/>
                <MiniButton icon="maximize" onclick={ e => console.log(e) }/>
                <MiniButton icon="minimize" onclick={ e => console.log(e) }/>
                <div className="logo">
                    <span className="stripe"/>
                    <img src={String(logo)}/>
                    <span className="stripe"/>
                </div>
                <MiniButton icon="more" wide={true} onclick={ e => console.log(e) }/>
            </section>
}