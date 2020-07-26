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
  private store: Subscription;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.userService.getUser(this.vkId).subscribe(user => {
      if (user.body.user) {
        this.storeService.setStore({user: this.user});
        this.store = this.storeService.storeObservable.subscribe((store) => {
          if (store && store.user) {
            this.user = store.user;
          }
        });
      }
      if (user.body.error) {
        if (user.body.error.code === 0) {
          localStorage.clear();
          this.router.navigate(['/auth']);
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.store) {
      this.store.unsubscribe();
    }
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
