import { Component } from '@angular/core';
import { SideBarService } from './services/side-bar.service';
import { ShadowInOut } from './animations';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  template:
    '<router-outlet></router-outlet>' +
    '<app-sidebar></app-sidebar>',
  animations: [ShadowInOut.animationTrigger],
})
export class AppComponent {

  constructor(
    private swUpdate: SwUpdate,
  ) {
    addEventListener('offline', (e) => {
      console.log('Подключение к сети Интернет отсутствует');
    });

    addEventListener('online', (e) => {
      console.log('Подключение к сети Интернет восстановлено');
    });

    interval(10000).subscribe(() => {
      this.swUpdate.checkForUpdate()
    })

    this.swUpdate.available.subscribe(event => {
      this.swUpdate.activateUpdate().then(() => document.location.reload())
    })

    this.swUpdate.activated.subscribe(ev => {
      console.log('Previous version: ', ev.previous)
      console.log('Current version: ', ev.current)
    })
  }
}
