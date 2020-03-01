import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<div style="text-align:center" class="content"><h1>{{title}}</h1></div>`,
  styles: []
})
export class AppComponent {

  title = 'editor';

  constructor(
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    const path: string = this.route.snapshot.queryParamMap.get('path');
    this.title = "editor for: " + this.route.snapshot
  }
}
