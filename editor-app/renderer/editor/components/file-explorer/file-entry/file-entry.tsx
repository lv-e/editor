import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"


import "./file-entry.less"


interface FileEntryProps {
    file:lv.fileMap
}

export const FileEntry: React.SFC<FileEntryProps> = (props) => {
    return  <li className="file-entry">
                <button className="colorize" onClick={ e => console.log(e) }>
                    <i className="ico-cartridge"/>
                    <span className="title">{props.file.name}</span>
                    <span className="extension">{props.file.extension}</span>
                </button>
            </li>
}