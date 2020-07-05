import * as React from "react";
import * as Electron from "electron";

import { MiniButton } from "../../../../app-components/mini-button/mini-button";
import "./header.less"

declare function require(path: string);
const logo = require('../../../../app-assets/images/bg/header-logo-bg.png');

export function Header (props) {

    function handleClose(event:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        const electron = window.require('electron');
        const ipcRenderer  = electron.ipcRenderer;
        ipcRenderer.send("welcome:close")
    }

    return <>
    <section id="welcome-header">
        <MiniButton icon="close" onclick={handleClose}/>
        <div className="logo">
            <span className="stripe"/>
            <img src={String(logo)}/>
            <span className="stripe"/>
        </div>
    </section></>
}