import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private ipc: IpcRenderer | undefined = void 0;

  constructor() {
    if ((window as any).require) {
      try {
        this.ipc = (window as any).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron IPC was not loaded');
    }
  }

  public on(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }

    this.ipc.on(channel, listener);
  }

  public send(channel: string, ...args): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.send(channel, ...args);
  }
}

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
  title = 'welcome';

  constructor(private readonly ipc: IpcService) {
    
  }

  handleOpen(event:Event) {
    this.ipc.on('welcome:project-choosen', (event, arg) => {
      this.ipc.send('project:open', arg)  
    })
    this.ipc.send('welcome:open-file')
  }
}
