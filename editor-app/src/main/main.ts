import {app} from 'electron'
import Dockerode, { Container, Exec } from 'dockerode-ts';
import * as fs from 'fs'

let docker = new Dockerode()

function streamToString (stream:any) {
    const chunks:any = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk:any) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }

app.on('ready', () => {

    bootstrapCLIContainer( container => {
        container.exec({Cmd:["lv-cli", "help"], AttachStdin: true, AttachStdout: true}, (err, command:Exec) =>{
            command.start({}, (error, data) => {
                streamToString(data).then( (str) => {
                    console.log("--" + str + "--")
                })
            })
        }) 
    })
})

function bootstrapCLIContainer( callback:(container:Container) => void) {
    docker.createContainer({ 
        Image: 'lvedock/lve_runtime',
        Tty: true,
        AttachStdout: true,
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