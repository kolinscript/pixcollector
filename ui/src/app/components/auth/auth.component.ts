import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('router.url: ', this.router.url);
    if (this.router.url.slice(0, 10) === '/auth?code') {
      this.code = this.router.url.slice(11);
      console.log('code: ', this.code);
      this.authService.code(this.code).subscribe(user => {
        if (user.body.user) {
          localStorage.setItem('token', user.body.user.token);
          const safeUser = ({ token, pixArray, ...rest }) => rest;
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
          this.router.navigate(['/auth/success']);
        }
      });
    } else if (this.router.url === '/auth/success') {
      this.state = State.success;
      this.authService.success().subscribe(user => {
        console.log(user);
        if (!user.body.user) {
          // this.router.navigate(['/auth']);
        } else if (user.body.user) {
          localStorage.setItem('token', user.body.user.token);
          const safeUser = ({ token, pixArray, ...rest }) => rest;
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
        }
      });
    }
    // if (this.authService.isAuthorized) {
    //   this.router.navigate(['']);
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
