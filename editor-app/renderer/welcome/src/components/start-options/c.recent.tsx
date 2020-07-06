import * as React from "react";
import { ipc } from "[comps]/electron/ipcRenderer";
import "./start-options.less"

export function Recent (props) {

    const games = [
        { name:"zelda", path:"/opt/games/lvnder"},
        { name:"mario", path:"/tmp/tests"},
        { name:"tenis", path:"~/Desktop/games"}
    ]

    let tags = games.map( game => {
        return <>
            <li className="recent-game">
                <button className="colorize">
                    <i className="ico-cartridge"/><span className="title">{game.name}</span><br/>
                    <i className="inline-ico-folder"/><span className="path">{game.path}</span>
                </button>
            </li>
        </>
    });
    
    return <div className="recent">
        <h1>✦ Recent projects</h1>
        <ul>
            {tags}
            <li className="open-game">
                <button className="colorize" onClick={ e => ipc("welcome:open-project") }>
                    <i className="ico-folder"/><span className="title">open another project ...</span><br/>
                </button>
            </li>
        </ul>
    </div>
}