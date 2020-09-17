import * as React from "react";
import * as lv from "@lv-game-editor/lv-cli"
import { useEffect, useState } from "react";

import "./driver-selector.less"
import { ipc } from "[comps]/electron/ipcRenderer";
import { Project } from "[comps]/electron/project";
import { DropList} from "[comps]/ui/droplist";

export function DriverSelector (props) {

    let [driver, setDriver] = useState<string|null>(null)
    let [drivers, setDrivers] = useState<string[]>([])

    useEffect(() => {
        if (driver == null) {
            ipc.editor.bind("project-changes", (project:lv.projectContent) => {
                setDrivers(project.header.drivers.map( d => d.name))
                project.header.drivers.forEach ( driver => {
                    if (driver.current != true) return
                    setDriver(driver.name)
                })
            })
        } 
    })

    let droplist = DropList(drivers)

    droplist.setCallback( selected =>{
        Project.edit( project => {
            let edit = project
            for (let i = 0; i < project.header.drivers.length; i++) {
                const element = project.header.drivers[i];
                element.current = element.name == selected
            }
            return edit
        })
    })

    return <>
        <button className="driver-selector glow" onClick={ e => {
            droplist.configureFor(e.nativeEvent.target as HTMLButtonElement)
            droplist.toggle(true)
        }}>{driver}</button>
        { droplist.tsx }
    </>
}