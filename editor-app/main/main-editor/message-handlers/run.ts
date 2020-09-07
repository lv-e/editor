import { IpcMainEvent } from "electron";
import { DockerInterface } from "../docker-interface";
import { EditorScreen } from "../editor-main";

export function run(e:IpcMainEvent){
    
    let path   = EditorScreen.shared.pathForEvent(e)
    let docker = DockerInterface.accessForProject(path)

    docker.encode( encodeSuccess => {
        if (!encodeSuccess) {
            console.error("can't encode project") 
            return
        }

        docker.build( path, buldSuccess => {
            if (!buldSuccess) {
                console.error("can't build project") 
                return
            } else {
                console.info("it works!") 
            }
        })
    })
}