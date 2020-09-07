import * as React from "react";
import { useEffect, useState } from "react";
import { ipc } from "[comps]/electron/ipcRenderer";

export function SystemStatus (props) {

    let [logs, setLogs] = useState<string[]|null>(null)

    useEffect(() => {
        if (logs == null) {
            ipc.editor.bind("docker-log", (logs:string[]) => {
                setLogs(logs)
            })
        } 
    })

    return  <section id="system-status">
                <p>{ logs != null && logs[logs.length - 2]}</p>
            </section>
}