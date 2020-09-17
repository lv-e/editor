import * as React from "react";

import "./square-button.less"

interface SquareButtonProps {
    icon?:("play" | "abort" | "new-scene" | "new-folder" | "new-file")
    onclick:(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const SquareButton: React.SFC<SquareButtonProps> = (props) => {

    return (
        <button className={`glow square-button`} onClick={props.onclick}>
            { props.icon != null ? 
                <img className={`icon icon-${props.icon}`}/> : ""
            }
        </button>
    )
}