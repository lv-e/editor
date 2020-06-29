import * as React from "react";
import "./start-options.less"


export function Welcome (props) {
    return <div className="welcome">
        <h1>✦ Welcome!</h1>
        <ul>
            <li><button className="colorize create-new">
                <i className="icon new-game"/>
                create new game
            </button></li>
            <li><button className="colorize read-docs">
                <i className="icon new-game"/>
                read the docs
            </button></li>
        </ul>
    </div>
}