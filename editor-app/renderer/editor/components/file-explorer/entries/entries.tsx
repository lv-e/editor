import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"

import "./entries.less"

export type DirKind = ("inner" | "shared" | "scene")
export interface DirEntryProps {
    dir:lv.dirMap
    kind:DirKind
}

export const DirEntry: React.SFC<DirEntryProps> = (props) => {

    let display_name:string
    let display_extension:string

    switch (props.kind) {
        case "shared":
            display_name = props.dir.name.replace("shared_", "")
            display_extension = "shared folder"
            break 
        case "scene":
            display_name = props.dir.name.replace("scene_", "")
            display_extension = "scene"
            break 
    }  

    return  <li className="dir-entry">
                <button className="colorize" onClick={ e => console.log(e) }>
                    <i className={`ico-${props.kind}`}/>
                    <span className="title">{display_name}</span>
                    <span className="extension">{display_extension}</span>
                </button>
            </li>
}

interface FileEntryProps {
    file:lv.fileMap
}

export const FileEntry: React.SFC<FileEntryProps> = (props) => {

    let ico:string = "file"
    switch (props.file.extension){
        case ".lvproject": ico = "ico-cartridge"; break 
    }

    return  <li className="file-entry">
                <button className="colorize" onClick={ e => console.log(e) }>
                    <i className="ico-cartridge"/>
                    <span className="title">{props.file.name}</span>
                    <span className="extension">{props.file.extension}</span>
                </button>
            </li>
}