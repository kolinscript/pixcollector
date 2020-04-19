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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log(this.router.url);
    if (this.router.url === '/auth/success') {
      this.state = State.success;
      this.authService.success().subscribe((user) => {
        console.log(user);
        if (!user.data.body.user) {
          // this.router.navigate(['/auth']);
        } else if (user.data.body.user) {
          localStorage.setItem('token', user.data.body.user.token);
          const safeUser = ({ token, pixArray, ...rest }) => rest;
          localStorage.setItem('user', JSON.stringify(safeUser(user.data.body.user)));
        }
      });
    }
    // if (this.authService.isAuthorized) {
    //   this.router.navigate(['']);
    // }
  }

  ngOnInit(): void {
  }

  public loginVk(): void {
    const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
      '?client_id=7372433' +
      '&display=page' +
      '&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth' +
      '&scope=friends,photos,offline' +
      '&response_type=code' +
      '&v=5.103';
    window.open(AUTH_URL_AUTHORIZE, "_self")
  }

}
