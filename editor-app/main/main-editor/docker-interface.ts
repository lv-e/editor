import Dockerode, { Container, Exec, ContainerCreateOptions, ContainerInspectInfo } from 'dockerode-ts';
import { dirname, join } from 'path';
import { isDevelopment } from '..';
import { readFileSync } from 'fs';
import * as cli from '@lv-game-editor/lv-cli'

let dockerInstance:Dockerode = null
function docker() : Dockerode {
    if (dockerInstance == null) dockerInstance = new Dockerode()
    return dockerInstance
}

let accessList:DockerInterface[] = new Array<DockerInterface>()

export class DockerInterface {

    containerID:string
    path:string

    static accessForProject(path:string) : DockerInterface {
        
        for (const access of accessList) {
            if(access.path.trim() == path.trim()) return access
        }

        let access = new DockerInterface(path)
        accessList.push(access)
        return access
    }

    private constructor(path:string){
        this.path = path
    }

    dir() : string {
        return dirname(this.path).trim()
    }

    withContainer(action:(Container) => void){
        this.isUp( (up, container) => {
            try {
                if (up && container != null) action(container)
                else this.bootContainer(action)
            } catch (error) {
                console.error("can't load container!", error)
                throw error
            }
        })
    }

    private bootContainer(completion:(Container) => void){

        let container:Container = null
        let context = this
        
        let options:ContainerCreateOptions = { 
            Image: 'lvedock/lve_emulator',
            Cmd:['/bin/sh'],
            Tty: true, AttachStdout: true, AttachStderr: true, AttachStdin: true,
            HostConfig:{
                Binds:[
                    this.dir() + ":/lv/project",
                    this.dir() + "/.shared:/lv/shared",
                    this.dir() + "/.bin:/lv/bin",
                ]
            }
        }
    
        docker().createContainer(options, onCreate)
    
        function onCreate(error:any, response:Container | undefined){
            if(error != null) throw new Error("can't load container! \n" + error)
            if(response == null) throw new Error("can't load container")
            container = response
            container.start(onStart);
        }
    
        function onStart(error:any, data:any){
            if(error != null) throw new Error("Can't start cli container! reason: " + error)
            console.log(
                "A new container has been shipped!",
                "\n-id is: " + container.id,
                "\n-mount: " + context.dir()
            )
            context.containerID = container.id
            completion(container)
        }
    }

    private isUp(callback:(bool, Container?) => void){
        
        let container = docker().getContainer(this.containerID)

        if (container == null || container.id == undefined) {
            callback(false, null)
            return
        }

        container.inspect({}, inspectCallback)

        function inspectCallback(error: any, info:ContainerInspectInfo) {
            try { 
                if (error != null) callback(false, null)
                else if (info.State.Running == true) callback(true, container)
            } catch { 
                callback(false, null)
            }
        }
    }

    stop(){
        
        accessList = accessList.filter( access => access != this)
        let container = docker().getContainer(this.containerID)

        if (isDevelopment) console.log("container id " + this.containerID + " was asked to stop")
        container.stop( () => { container.remove( () => { console.log("stoped!")})})
        this.path = null
    }

    scan(completion:(data:cli.rootFolders) => void){
        this.runLvCLI({
            command: "scan",
            input: "/lv/project",
            output: "/lv/shared/project.json"
        }, () => {
            let path = join(this.dir(), ".shared", "project.json")
            const projectJson = readFileSync(path, "utf8")
            const root:cli.rootFolders = JSON.parse(projectJson) 
            completion(root)
        })
    }

    encode(completion:(success:boolean) => void){
        this.runLvCLI({
            command: "encode",
            input: "/lv/shared/project.json",
            output: "/lv"
        }, () => {
            completion(true)
        })
    }

    runLvCLI(data:{command:string, input:string, output:string}, callback:() => void){

        this.withContainer( (container) => {

            const decoder = this.streamToString
            const context = this 

            const command = [
                "lv-cli", isDevelopment ? "verbose" : "", data.command,
                "-i", data.input, "-o", data.output
            ]

            const options = {
                Cmd: command,
                AttachStderr: true,
                AttachStdout: true
            }
            
            container.exec(options, execCommand)

            function execCommand(err:any, command:Exec) {

                if (err != null)
                    throw new Error("can't run scan. exec failed!")

                command.start({}, execResponse)
            }

            function execResponse(error:any, stream:any){

                if (error != null || stream == null)
                    throw new Error("invalid response from scan!")

                decoder(stream).then( (response:string) => {

                    if (response.includes("cannot exec in a stopped state") || response.trim() == "") {
                        context.containerID = null
                        context.runLvCLI(data, callback)
                    } else {
                        if (isDevelopment) console.log("<lvcli> " + response + " </lvcli>")
                        callback()
                    }
                    
                }).catch(() => {
                    throw new Error("can't decode stream")
                })
            }
        })
    }

    private streamToString (stream:any) {
        const chunks:any = []
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk:any) => chunks.push(chunk))
            stream.on('error', reject)
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        })
    }
}