import { Component } from '@angular/core';
import { SideBarService } from './services/side-bar.service';
import { ShadowInOut } from './animations';

@Component({
  selector: 'app-root',
  template:
    '<router-outlet></router-outlet>' +
    ' <div class="no-interaction-screen"\n' +
    '       *ngIf="sideBar.sideBars.length > 0"\n' +
    '       (click)="sideBarClose()"\n' +
    '       [@shadowInOut]\n' +
    '  ></div>\n' +
    '  <app-sidebar></app-sidebar>',
  styles:
    ['.no-interaction-screen {\n' +
  '  z-index: 99;\n' +
  '  position: fixed;\n' +
  '  width: 100%;\n' +
  '  height: 100%;\n' +
  '  top: 0;\n' +
  '  left: 0;\n' +
  '  background: rgba(0, 0, 0, .5);\n' +
  '}'],
  animations: [ShadowInOut.animationTrigger],
})
export class AppComponent {

  constructor(
    public sideBar: SideBarService
  ) {}

  public sideBarClose(): void {
    this.sideBar.closeSideBar();
  }
}
