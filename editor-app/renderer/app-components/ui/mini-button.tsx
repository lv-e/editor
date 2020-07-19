import * as React from "react";

import "./mini-button.less"

interface MiniButtonProps {
    icon:("close" | "maximize" | "minimize" | "more")
    wide?:boolean
    onclick:(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const MiniButton: React.SFC<MiniButtonProps> = (props) => {

    const wideClass = props.wide == true ? " wide" : ""
    return (
        <button className={`colorize minibutton ${wideClass}`} onClick={props.onclick}>
            <img src="1px.png" className={`minibutton icon icon-${props.icon} ${wideClass}`}/>
        </button>
    )
}