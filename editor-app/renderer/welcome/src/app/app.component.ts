import { Component } from '@angular/core';
import { IpcService } from './ipc.service';

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align:center" class="content">
      <h1>{{title}}</h1>
      <button (click)="handleOpen($event)">open</button>
    </div>
  `,
  styles: []
})
export class AppComponent {

  constructor(private readonly ipc: IpcService) { }
  title = 'welcome';

  handleOpen(event:Event) {
    this.ipc.on('welcome:project-choosen', (event, arg) => {
      this.ipc.send('editor:open-project', arg)  
    })
    this.ipc.send('welcome:open-project')
  }
}
