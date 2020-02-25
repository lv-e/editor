import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div style="text-align:center" class="content"><h1>{{title}}</h1></div>`,
  styles: []
})
export class AppComponent {
  title = 'editor';
}
