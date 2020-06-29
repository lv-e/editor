import * as React from "react";

import "./mini-button.less"

interface MiniButtonProps {
    icon:("close" | "maximize" | "minimize")
}

export const MiniButton: React.SFC<MiniButtonProps> = (props) => {
    return (
        <button className="colorize minibutton">
            <img src="1px.png" className={`minibutton icon icon-${props.icon}`}/>
        </button>
    )
}