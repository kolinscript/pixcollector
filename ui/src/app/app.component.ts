import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  template:
    '<router-outlet></router-outlet>' +
    '<app-sidebar></app-sidebar>',
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

    interval(300000).subscribe(() => {
      console.log('Service Worker is checking for updates..');
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
