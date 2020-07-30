import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"
import { ipc } from "[comps]/electron/ipcRenderer"
import {FileEntry, DirEntry, DirEntryProps, DirKind, DirList} from "./entries/entries"

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
                        && <FileEntry file={rootFolders.project_file} level={0}/>
                    }
                    { rootFolders != null && rootFolders.shared != null 
                        && <DirList dirs={rootFolders.shared} kind="shared" level={0}/>
                    }
                    { rootFolders != null && rootFolders.scenes != null 
                        && <DirList dirs={rootFolders.scenes} kind="scene" level={0}/>
                    }
                </ul>
            </section>
}