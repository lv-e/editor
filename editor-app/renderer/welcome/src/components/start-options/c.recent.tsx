import * as React from "react";
import { useState, useEffect } from "react";
import { ipc, fetch } from "[comps]/electron/ipcRenderer";
import { FileEntry } from "[managers]/recent-files"
import "./start-options.less"

export function Recent (props) {
    
    let [games, setGames] = useState<FileEntry[]|null>(null)
    
    useEffect( () => {
        if (games != null) return 
        fetch("welcome", "recent-projects", gs => {
            setGames(gs as FileEntry[])
        })
    })

    return <div className="recent">
        <h1>✦ Recent projects</h1>
        <ul>
            { games != null ? games.slice(0,3).map( (game, i) => <RecentGame game={game} key={i}/>) : null }
            <li className="open-game">
                <button className="colorize" onClick={ e => ipc().send("welcome:open-project") }>
                    <i className="ico-folder"/><span className="title">open another project ...</span><br/>
                </button>
            </li>
        </ul>
    </div>
}

function RecentGame ({game}:{game:FileEntry}) {
    return  <li className="recent-game">
                <button className="colorize">
                    <i className="ico-cartridge"/><span className="title">{game.resourceName}</span><br/>
                    <i className="inline-ico-folder"/><span className="path">{game.directoryPath}</span>
                </button>
            </li>
}