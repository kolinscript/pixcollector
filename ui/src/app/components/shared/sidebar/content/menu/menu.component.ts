import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../../../../services/side-bar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { StoreService } from '../../../../../services/store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public form: FormGroup;
  public href: string;
  public user;

  constructor(
    private store: StoreService,
    private sideBar: SideBarService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = this.store.store.user;
    this.href = `https://vk.com/id${this.user.vkId}`;
    this.store.storeObservable.subscribe((store) => {
      console.log('store: ', store);
    })
    this.initForm();
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
    this.sideBar.closeSideAllBars();
  }

  private initForm(): void {
    this.form = this.fb.group({
      privacyVisible: [this.user.privacyVisible ? this.user.privacyVisible : null],
      privacyDownloadable: [this.user.privacyDownloadable ? this.user.privacyDownloadable : null]
    });
    this.form.get('privacyVisible').valueChanges.subscribe((privacy) => {
      const userUpdates = {
        user: {
          vkId: this.user.vkId,
          privacyVisible: +privacy,
        }
      };
      this.userService.updUser(userUpdates).subscribe((user) => {
        console.log(user);
        this.store.setStore({user: user.body.user});
      });
    });
    this.form.get('privacyDownloadable').valueChanges.subscribe((privacy) => {
      const userUpdates = {
        user: {
          vkId: this.user.vkId,
          privacyDownloadable: +privacy,
        }
      };
      this.userService.updUser(userUpdates).subscribe((user) => {
        console.log(user);
      });
    });
  }

}
