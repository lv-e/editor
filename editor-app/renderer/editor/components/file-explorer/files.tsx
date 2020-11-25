import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"
import { ipc } from "[comps]/electron/ipcRenderer"
import { Project } from "[comps]/electron/project"
import {FileEntry, DirEntry, DirEntryProps, DirKind, DirList} from "./entries/entries"

import "./file-explorer.less"
import { useState, useEffect } from "react";

export function Files (props) {

    let [rootFolders, setRootFolders] = useState<lv.rootFolders|null>(null)
    let [selectedFile, setSelectedFile] = useState<string|null>(null)

    useEffect( () => {

        let projectCleaner = ipc.editor.bind("project-changes", (folders:lv.rootFolders) => {
            setSelectedFile( old => {
                let newValue = Project.current.editor.selectedFile
                if (old == null || old != newValue) return newValue
                else return old
            })
        })
        
        let filesCleaner = ipc.editor.bind("project-files", (folders:lv.rootFolders) => {
            setRootFolders( old => {
                if (old == null || old.tag != folders.tag) return folders
                else return old
            })
        })

        return function cleaner(){
            projectCleaner()
            filesCleaner()
        }

    }, []);

    return  <div id="files">
                <section id="explorer-files">
                    <ul>
                        { rootFolders != null 
                            && <FileEntry file={rootFolders.project_file} selected={selectedFile} level={0}/>
                        }
                        { rootFolders != null && rootFolders.shared != null 
                            && <DirList dirs={rootFolders.shared} kind="shared"  selected={selectedFile} level={0}/>
                        }
                        { rootFolders != null && rootFolders.scenes != null 
                            && <DirList dirs={rootFolders.scenes} kind="scene"  selected={selectedFile} level={0}/>
                        }
                    </ul>
                </section>
            </div>
}