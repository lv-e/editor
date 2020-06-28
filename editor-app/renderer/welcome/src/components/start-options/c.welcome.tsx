import * as React from "react";
import "./start-options.less"

declare function require(path: string);
const icoNewGame = require('../../assets/images/button/new-game-btn.png');
const icoWiki    = require('../../assets/images/button/wiki-btn.png');

export function Welcome (props) {
    return <div className="welcome">
        <h1>✦ Welcome!</h1>
        <ul>
            <li><button>
                <img src={String(icoNewGame)}/>
                create new game
            </button></li>
            <li><button>
                <img src={String(icoWiki)}/>
                read the docs
            </button></li>
        </ul>
    </div>
}