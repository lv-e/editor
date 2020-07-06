import * as React from "react";
import { MiniButton } from "[comps]/ui/mini-button"
import { ipc } from "[comps]/electron/ipcRenderer"

import "./header.less"

export function Header (props) {

    const logo = require('[assets]/images/bg/header-logo-bg.png');

    return <>
    <section id="welcome-header">
        <MiniButton icon="close" onclick={ e => ipc("welcome:close") }/>
        <div className="logo">
            <span className="stripe"/>
            <img src={String(logo)}/>
            <span className="stripe"/>
        </div>
    </section></>
}