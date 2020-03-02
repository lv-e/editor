import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IpcService } from './ipc.service';
import { rootFolders } from '@lv-game-editor/lv-cli';

@Component({
  selector: 'app-root',
  template: `<pre [innerHTML]="project"></pre>`,
  styles: []
})
export class AppComponent implements OnInit {

  project:string
  path:string

  constructor(
    private zone: NgZone,
    private readonly ipc: IpcService,
    private route: ActivatedRoute
  ){}

  filesUpdate(root:rootFolders){
    this.project = JSON.stringify(root, null, 2)
  }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {

      this.path = params['path'];
      if (this.path == null) return

      this.project = "loading..."
      this.ipc.on("editor:project-files-updated",
        (ev, pt, root:rootFolders) => this.zone.run(() => {
          this.filesUpdate(root)
      }))
      this.ipc.send("editor:scan-project-files", this.path)
    });
  }
}
