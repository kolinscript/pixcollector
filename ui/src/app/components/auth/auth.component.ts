import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';

enum State {
  auth, success,
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  public StateEnum = State;
  public state: State = State.auth;
  code: string;

  constructor(
    private store: StoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.slice(0, 10) === '/auth?code') {
      this.code = this.router.url.slice(11);
      this.authService.code(this.code).subscribe(user => {
        if (user.body.user) {
          const safeUser = ({ token, pixArray, ...rest }) => rest;
          this.store.setStore({user: safeUser(user.body.user)});
          localStorage.setItem('token', user.body.user.token);
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
          this.router.navigate(['/auth/success']);
        }
      });
    } else if (this.router.url === '/auth/success') {
      this.state = State.success;
      this.authService.success().subscribe(user => {
        if (user.body.user) {
          const safeUser = ({ token, pixArray, ...rest }) => rest;
          this.store.setStore({user: safeUser(user.body.user)});
          localStorage.setItem('token', user.body.user.token);
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
        } else if (!user.body.user) {
          // this.router.navigate(['/auth']);
        }
      });
    }
    // if (this.authService.isAuthorized) {
    //   this.router.navigate(['/stocks']);
    // }
  }

  public loginVk(): void {
    const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
      '?client_id=7372433' +
      '&display=page' +
      '&redirect_uri=https://pixcollector.herokuapp.com/auth' +
      '&scope=friends,photos,offline' +
      '&response_type=code' +
      '&v=5.103';
    window.open(AUTH_URL_AUTHORIZE, "_self")
  }

}
