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
  authorized: boolean = false;

  constructor(
    private authService: AuthService,
    private sideBar: SideBarService
  ) { }

  ngOnInit(): void {
    this.authorized = this.authService.isAuthorized();
  }

  public openMenu(type: SideBarTypes): void {
    this.sideBar.openSideBar({type: type}).subscribe((sideBarRes) => {
      console.log('sideBarRes', sideBarRes);
    });
    // this.sideBar.sideBarsObservable.subscribe((sideBars) => {
    //   console.log('sideBars', sideBars);
    //   if (sideBars.length === 0) {
    //     // this.init();
    //   }
    // });
  }

}
