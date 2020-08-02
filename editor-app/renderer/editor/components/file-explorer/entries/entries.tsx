import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"

import "./entries.less"
import { useState } from "react";
import { Project } from "[comps]/electron/project";

export type DirKind = ("folder" | "shared" | "scene")

export interface DirEntryProps {
    dir:lv.dirMap
    kind:DirKind
    level:number
}

interface FileEntryProps {
    file:lv.fileMap
    level:number
}

export function DirList ({dirs, kind, level}:{
    dirs:(lv.dirMap[]|null),
    kind:DirKind
    level:number
}){
    return <>
        { dirs != null 
            && dirs.map( (dir, i) => <DirEntry kind={kind} dir={dir} key={i} level={level}/> )
        }
    </>
}

export function FileList ({files, level}:{
    files:(lv.fileMap[]|null),
    level:number
}){
    return <>
        { files != null 
            && files.map( (dir, i) => <FileEntry file={dir} key={i} level={level}/> )
        }
    </>
}

export const DirEntry: React.SFC<DirEntryProps> = (props) => {

    let display_name:string
    let display_extension:string

    const initialState = function() {

        const project = Project.current
        console.log(project)

        if (project && project.editor && project.editor.openedFiles) {
            return project.editor.openedFiles.includes(props.dir.path);
        } else {
            return false 
        }
    }()

    let [openned, setOpenned] = useState(initialState)

    switch (props.kind) {
        case "shared":
            display_name = props.dir.name.replace("shared_", "")
            display_extension = "shared folder"
            break 
        case "scene":
            display_name = props.dir.name.replace("scene_", "")
            display_extension = "scene"
            break 
        case "folder":
            display_name = props.dir.name
            display_extension = "folder"
            break 
    }  

    const stateIcon = openned ? "minus" : "plus"

    return  <>
        <li className="dir-entry">
            <button className="colorize" onClick={ e => setOpenned(!openned) }>
                <i className={`ico-${stateIcon}`} style={{marginLeft: `${props.level * 14}px`}}/>
                <i className={`ico-${props.kind}`}/>
                <span className="title">{display_name}</span>
                <span className="extension">{display_extension}</span>
            </button>
        </li>
        { props.dir.directories != null && openned
            && <DirList dirs={props.dir.directories} kind="folder" level={props.level + 1}/>
        }
        { props.dir.files != null && openned
            && <FileList files={props.dir.files} level={props.level + 1}/>
        }
    </>
}

export const FileEntry: React.SFC<FileEntryProps> = (props) => {

    let ico:string = "file"

    switch (props.file.extension){
        case ".lvproject": ico = "cartridge"; break;
        case ".lvcode": ico = "file-lvcode"; break;
        case ".lvsprite": ico = "file-lvsprite"; break;
        default: ico = "file-any"; break;
    }

    return  <li className="file-entry">
                <button className="colorize" onClick={ e => console.log(e) }>
                    <i className="ico-align" style={{marginLeft: `${props.level * 14}px`}}/>
                    <i className={`ico-${ico}`}/>
                    <span className="title">{props.file.name}</span>
                    <span className="extension">{props.file.extension}</span>
                </button>
            </li>
}