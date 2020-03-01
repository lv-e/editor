import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ipcRenderer } from 'electron';
import { dirname } from 'path' 
import { IpcService } from './ipc.service';

@Component({
  selector: 'app-root',
  template: `<div style="text-align:center" class="content"><h1>{{title}}</h1></div>`,
  styles: []
})
export class AppComponent implements OnInit {

  title = 'editor';
  path:string = null
  container:string = null

  constructor(
    private readonly ipc: IpcService,
    private route: ActivatedRoute
  ){}

  ngOnInit() {

    this.route.queryParams.subscribe( params => {

      this.path = params['path'];
      if (this.path != null) {

        console.log("loading editor for: " + this.path);
        
        this.ipc.on("editor:container-id-updated", (event:any, path:String, containerID:string) => {
          if (path == dirname(this.path).trim()) {
            console.log("container id is: " + containerID)
            this.container = containerID
          }
        })

        this.ipc.send("editor:start-docker", this.path)
      }
    });
  }
}
