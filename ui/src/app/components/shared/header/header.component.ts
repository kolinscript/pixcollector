import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SideBarService } from '../../../services/side-bar.service';
import { SideBarTypes } from 'src/app/models/side-bar.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  SideBarTypes = SideBarTypes;
  authorized: boolean = false;

  constructor(
    private authService: AuthService,
    private sideBar: SideBarService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authorized = this.authService.isAuthorized();
  }

  public openMenu(type: SideBarTypes): void {
    this.sideBar.openSideBar({type: type}).subscribe((sideBarRes) => {
      if (sideBarRes && sideBarRes.reload) {
        if (this.router.url === '/chart') {
          this.reloadRoute();
        }
      }
    });
  }

  private reloadRoute() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`${this.router.url}`]);
  }

}
