import * as cli from '@lv-game-editor/lv-cli';
import Dockerode, { Container, ContainerCreateOptions, ContainerInspectInfo, Exec } from 'dockerode-ts';
import { readFileSync } from 'fs';
import * as kt from "keytar";
import { dirname, join } from 'path';
import { isDevelopment } from '..';
import { ipc } from '../components/electron/ipcMain';

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

        ipc.editor.on('before-close', (e, path) => {
            if (path.trim() != this.path.trim()) return
            this.stop()
        })
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
        let context:DockerInterface = this
        
        let options:ContainerCreateOptions = { 
            Image: 'lvedock/lve_odroid_go:latest',
            Cmd:['/bin/sh'],
            ExposedPorts: {
                '3100/tcp': {},
                '3101/tcp': {},
                '3102/tcp': {},
                '3103/tcp': {},
                '3104/tcp': {},
                '3105/tcp': {}
            },
            Tty: true, AttachStdout: true, AttachStderr: true, AttachStdin: true,
            HostConfig:{
                PortBindings: {
                    '3100/tcp': [{ HostPort: '3100'}],
                    '3101/tcp': [{ HostPort: '3101'}],
                    '3102/tcp': [{ HostPort: '3102'}],
                    '3103/tcp': [{ HostPort: '3103'}],
                    '3104/tcp': [{ HostPort: '3104'}],
                    '3105/tcp': [{ HostPort: '3105'}]
                },
                Binds:[
                    this.dir() + ":/lv/project",
                    this.dir() + "/.shared:/lv/shared",
                    this.dir() + "/.bin:/lv/bin",
                    "/dev/tty.SLAB_USBtoUART:/dev/bus/usb"
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

            context.isUp( (state, c) => {
                if (!state) console.log("Something is wrong")
                completion(container)
            })
        }
    }

    private isUp(callback:(bool, Container?) => void){
    
        if (this.containerID == null) {
            callback(false, null)
            return 
        }

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
                else callback(false, null)
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
            output: "/lv/source"
        }, () => {
            completion(true)
        })
    }

    edit(port:string, file:string, completion:(success:boolean) => void){
        this.runLvCLI({
            command: "edit",
            input: file,
            output: port,
            project: "/lv/project/game.lvproject"
        }, () => {
            completion(true)
        })
    }

    log(str:string, then:() => void){
        this.runLvCLI({
            command: "log",
            input: str,
            output: null
        }, () => then() )
    }

    private async retrieveSecrets(path:string) : Promise<string> {

        const file = readFileSync(path, {encoding: "utf-8"})
        const project:cli.projectContent = JSON.parse(file)

        let response:{[name: string]: string} = {}

        for (let dx in project.header.drivers) {

            const driver = project.header.drivers[dx]
            
            if (driver.current != true) continue;
            if (driver.secrets == null) continue;
            
            for (let key in driver.secrets) {
                let service = driver.secrets[key];
                let storedSecret = await kt.findPassword(service)
                response[key] = storedSecret
            }
        }

        for(var prop in response) {
            // at least one key
            if(response.hasOwnProperty(prop)){
                return Buffer
                    .from( JSON.stringify(response, null, "\t") )
                    .toString("base64");
            }
        }
        
        return "";
    }

    async build(projectPath:string, completion:(success:boolean) => void){

        console.log("starting build... looking for secrets")
        const secrets = await this.retrieveSecrets(projectPath)
        console.log("done! calling lv-cli")
        
        this.runLvCLI({
            command: "build",
            input: `/lv/scripts/build.sh ${secrets}`,
            bag: secrets,
            output: "/lv/bin"
        }, () => {
            completion(true)
        })
    }

    runLvCLI(data:{command:string, input:string, output:string, bag?:string, project?:string},
        callback:() => void){

        this.withContainer( (container) => {

            const decoder = this.streamToString
            const context = this 

            let command = [
                "lv-cli", isDevelopment ? "verbose" : "", data.command,
                "-i", data.input
            ]

            if (data.output != null) {
                command.push("-o")
                command.push(data.output)
            }

            if (data.bag != null) {
                command.push("-b")
                command.push(data.bag)
            }

            if (data.project != null) {
                command.push("-p")
                command.push(data.project)
            }

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

                    if (response.includes("cannot exec in a stopped state")) {
                        console.log(`can't run. restart container?`)
                    } else {
                        if (isDevelopment) console.log("\n<lvcli> " + response + "</lvcli>\n")
                        callback()
                    }
                    
                }).catch(() => {
                    console.log(`empty response for ${data.command}`)
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
