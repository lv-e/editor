import {app} from 'electron'
import Dockerode, { Container, Exec } from 'dockerode-ts';
import * as fs from 'fs'

let docker = new Dockerode()

function streamToString (stream:any) {
    const chunks:Uint8Array[] = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk:Uint8Array) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }

app.on('ready', () => {

    bootstrapCLIContainer( container => {
        container.exec({Cmd:["lv-cli", "verbose", "scan", "-i", "/tmp/project", "-o", "/tmp/project/.build/project.json"], 
        AttachStdin: true, AttachStdout: true, AttachStderr: true}, (err, command:Exec) =>{
            if (err != null) {
                console.log("error:", err)
            } else {
                command.start({}, (error, data) => {
                    if (error != null) {
                        console.log("error:", err)
                    } else {
                        streamToString(data).then( (str) => {
                            console.log("--" + str + "--")
                        })
                    }

                })
            }
        }) 
    })
})

function bootstrapCLIContainer( callback:(container:Container) => void) {
    docker.createContainer({ 
        Image: 'lvedock/lve_runtime',
        Tty: true,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig:{
            Binds:["/Users/lino/Desktop/gueme:/tmp/project"]
        }
    }, (error:any, container:Container | undefined) => {
        if(container != undefined){
            container.start((error:any, data:any) => {
                if (error == null) callback(container)
                else console.error("Can't start cli container! reason: ", error)
            });
        } else {
            console.error("can't load cli container. reason: ", error)
        }
    })
}