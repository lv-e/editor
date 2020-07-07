import * as React from "react";
import { ipc } from "[comps]/electron/ipcRenderer";
import "./start-options.less"

function RecentGame ({game}:{game:{path:string, name:string}}) {
    return  <li className="recent-game">
                <button className="colorize">
                    <i className="ico-cartridge"/><span className="title">{game.name}</span><br/>
                    <i className="inline-ico-folder"/><span className="path">{game.path}</span>
                </button>
            </li>
}

export function Recent (props) {

    const games = [
        { name:"zelda", path:"/opt/games/lvnder", id:"asd"},
        { name:"mario", path:"/tmp/tests", id:"gh"},
        { name:"tenis", path:"~/Desktop/games", id:"art"}
    ]
    
    return <div className="recent">
        <h1>✦ Recent projects</h1>
        <ul>
            { games.map( (game, i) => <RecentGame game={game} key={i}/> ) }
            <li className="open-game">
                <button className="colorize" onClick={ e => ipc("welcome:open-project") }>
                    <i className="ico-folder"/><span className="title">open another project ...</span><br/>
                </button>
            </li>
        </ul>
    </div>
}