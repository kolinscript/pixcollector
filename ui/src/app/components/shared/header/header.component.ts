import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SideBarService } from '../../../services/side-bar.service';
import { SideBarTypes } from 'src/app/models/side-bar.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  SideBarTypes = SideBarTypes;
  public user;
  public href: string;

  constructor(
    private authService: AuthService,
    private sideBar: SideBarService
  ) { }

  ngOnInit(): void {
    const authorized = this.authService.isAuthorized();
    if (authorized) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.href = `https://vk.com/id${this.user.vkId}`;
    }
  }

  public openMenu(type): void {
    this.sideBar.openSideBar({
      type: type
    });
    this.sideBar.sideBarsObservable.subscribe((sideBars) => {
      if (sideBars.length === 0) {
        // this.init();
      }
    });
  }

}
