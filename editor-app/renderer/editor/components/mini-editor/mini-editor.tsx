import { rootFolders } from "@lv-game-editor/lv-cli";
import { WebviewTag } from "electron";
import * as React from "react";
import { useEffect, useState } from "react";
import { ipc } from "[comps]/electron/ipcRenderer";
import { Project } from "[comps]/electron/project";

import "./mini-editor.less"

export function MiniEditor (props) {

    let [editorURL, setEditorURL] = useState( () : string => {

        const current = Project.current.editor.selectedFile
        ipc.editor.atomicSend("edit-file", current)

        const url = ipc.editor.fetch('current-editor-url')
        console.log(`editor will load ${url}`)

        return url
    })
    
    useEffect( () => {

        return ipc.editor.bind("project-changes", (folders:rootFolders) => {
            setEditorURL( old => {
                let newURL = ipc.editor.fetch('current-editor-url')
                if (old == null || old != newURL) {
                    console.log(`will load editor at ${newURL}`)
                    return newURL
                }
                else return old
            })
        })

    }, []);

    let webview:JSX.Element = <webview 
        src={ editorURL} 
        style={{ width:"100%", height:"100%" }}
    ></webview>

    return webview
}