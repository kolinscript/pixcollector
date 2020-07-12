import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../../../../services/side-bar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { StoreService } from '../../../../../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public href: string;
  public user;
  private store: Subscription

  constructor(
    private storeService: StoreService,
    private sideBar: SideBarService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.store = this.storeService.storeObservable.subscribe((store) => {
      if (store && store.user) {
        this.user = store.user;
        this.href = `https://vk.com/id${this.user.vkId}`;
        this.initForm();
      }
    });
  }

  ngOnDestroy() {
    this.store.unsubscribe();
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
        if (user) {
          this.storeService.setStore({user: user.body.user});
        }
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
        if (user) {
          this.storeService.setStore({user: user.body.user});
        }
      });
    });
  }

}
