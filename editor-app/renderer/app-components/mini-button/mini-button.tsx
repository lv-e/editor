import * as React from "react";

import "./mini-button.less"

interface MiniButtonProps {
    icon:("close" | "maximize" | "minimize")
    onclick:(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const MiniButton: React.SFC<MiniButtonProps> = (props) => {
    return (
        <button className="colorize minibutton" onClick={props.onclick}>
            <img src="1px.png" className={`minibutton icon icon-${props.icon}`}/>
        </button>
    )
}