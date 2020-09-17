import * as React from "react";
import { ipc } from "[comps]/electron/ipcRenderer"
import { DropList } from "[comps]/ui/droplist";
import {MiniButton} from "../../../../app-components/ui/mini-button"

export function SystemControl (props) {

    const logo = require('[assets]/images/bg/header-logo-bg.png');

    let moreOptions = DropList(["settings", "help"])
    
    return  <section id="system-control">
                <MiniButton icon="close" onclick={ e => ipc.editor.send("close") }/>
                <MiniButton icon="maximize" onclick={ e => console.log(e) }/>
                <MiniButton icon="minimize" onclick={ e => console.log(e) }/>
                <div className="logo">
                    <span className="stripe"/>
                    <img src={String(logo)}/>
                    <span className="stripe"/>
                </div>
                <MiniButton icon="more" wide={true} onclick={ e => {
                    moreOptions.configureFor(e.nativeEvent.target as HTMLButtonElement)
                    moreOptions.toggle(true)
                }}/>
                { moreOptions.tsx }
            </section>
}