import * as React from "react";
import { useState, useEffect } from "react";
import { ipc } from "[comps]/electron/ipcRenderer";
import { FileEntry } from "[managers]/recent-files"
import "./start-options.less"

export function Recent () {
    
    let [games, setGames] = useState<FileEntry[]|null>(null)
    
    useEffect(() => {
        if (games == null) {
            ipc.welcome.get("recent-projects", gs => setGames(gs))
        }
    })

    return <div className="recent">
        <h1>✦ Recent projects</h1>
        <ul>
            <RecentGames games={games}/>
            <OpenAnother/>   
        </ul>
    </div>
}

// Inner Components

function RecentGames ({games}:{games:(FileEntry[]|null)}){
    return <>
        { games != null ? 
            games.slice(0,3).map( (game, i) =>  
                <RecentGame game={game} key={i}/>
            )
        : null }
    </>
}

function RecentGame ({game}:{game:FileEntry}) {
    return  <li className="recent-game">
                <button className="glow" onClick={ e => ipc.welcome.send("choose-project", game.filepath) }>
                    <i className="ico-cartridge"/><span className="title">{game.resourceName}</span><br/>
                    <i className="inline-ico-folder"/><span className="path">{game.directoryPath}</span>
                </button>
            </li>
}

function OpenAnother(){
    return  <li className="open-game">
                <button className="glow" onClick={ e => {
                    ipc.welcome.get("open-project", e => {
                        ipc.welcome.send("choose-project", e)
                    })}
                }>
                    <i className="ico-folder"/><span className="title">open project ...</span><br/>
                </button>
            </li>
}