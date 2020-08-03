import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"

import "./entries.less"
import { useState, useEffect } from "react";
import { Project } from "[comps]/electron/project";
import { ipc } from "[comps]/electron/ipcRenderer";

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

    let [openned, setOpenned] = useState(() => {
        return Project.current.editor.openedFiles.includes(props.dir.path);
    })

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
        case "folder":
            display_name = props.dir.name
            display_extension = "folder"
            break 
    }  

    const stateIcon = openned ? "minus" : "plus"

    function toggleOpened(e:React.MouseEvent){ 
        const saved = Project.edit( project => {
            if (!openned == true) project.editor.openedFiles.push(props.dir.path)
            else project.editor.openedFiles = project.editor.openedFiles.filter( d => d != props.dir.path)
            return project
        })
        
        if(saved) {
            const state = Project.current.editor.openedFiles.includes(props.dir.path)
            setOpenned(state)
        }
    }

    return  <>
        <li className="dir-entry">
            <button className="colorize" onClick={ e => toggleOpened(e) }>
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

    let [selected, setSelected] = useState(false)
    let ico:string = "file"

    switch (props.file.extension){
        case ".lvproject": ico = "cartridge"; break;
        case ".lvcode": ico = "file-lvcode"; break;
        case ".lvsprite": ico = "file-lvsprite"; break;
        default: ico = "file-any"; break;
    }

    function markSelection(e:React.MouseEvent){ 
        const saved = Project.edit( project => {
            project.editor.selectedFile = props.file.path
            return project
        })
        
        if(saved) {
            const state = Project.current.editor.selectedFile == props.file.path
            setSelected(state)
        }
    }

    return  <li className={`file-entry ${ selected ? "selected-file" : ""}`}>
                <button className="colorize" onClick={ e => markSelection(e) }>
                    <i className="ico-align" style={{marginLeft: `${props.level * 14}px`}}/>
                    <i className={`ico-${ico}`}/>
                    <span className="title">{props.file.name}</span>
                    <span className="extension">{props.file.extension}</span>
                </button>
            </li>
}