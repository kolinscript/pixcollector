import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user;
  public href;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthorized) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.href = `https://vk.com/id${this.user.vkId}`;
    }
  }

}
