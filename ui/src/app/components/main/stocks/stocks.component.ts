import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../services/store.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit, OnDestroy {
  public loader: boolean;
  public vkId: string = null;
  private user;
  private access_token: string = null;
  private store: Subscription;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.store = this.storeService.storeObservable.subscribe((store) => {
      this.loader = false;
      if (store && store.user) {
        this.user = store.user;
        this.vkId = store.user.vkId;
      }
    });
    if (this.router.url.slice(0, 20) === '/stocks#access_token') {
      const tokenEndIndex = this.router.url.indexOf('&expires_in');
      this.access_token = this.router.url.slice(21, tokenEndIndex);
      const userUpdates = {
        user: {
          vkId: this.user.vkId,
          vkTokenIF: this.access_token,
        }
      };
      this.userService.updUser(userUpdates).subscribe((user) => {
        if (user) {
          this.storeService.setStore({user: user.body.user});
        }
      });
    }
    if (this.router.url.slice(0, 13) === '/stocks#error') {
      console.log('ERROR: ', this.router.url.slice(14));
    }
  }

  ngOnDestroy() {
    this.store.unsubscribe();
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
