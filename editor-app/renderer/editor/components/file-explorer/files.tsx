import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"
import { ipc } from "[comps]/electron/ipcRenderer"
import {FileEntry} from "./file-entry/file-entry"

import "./file-explorer.less"
import { useState, useEffect } from "react";

export function Files (props) {

    let [rootFolders, setRootFolders] = useState<lv.rootFolders|null>(null)
    
    useEffect(() => {
        if (rootFolders == null) 
            ipc.editor.fetch("project-files",
                (folders:lv.rootFolders) =>  setRootFolders(folders))
    })

    return  <section id="explorer-files">
                <ul>
                    { rootFolders != null 
                        ? <FileEntry file={rootFolders.project_file}/> : null }
                </ul>
            </section>
}