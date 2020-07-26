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
    this.store = this.storeService.storeObservable.subscribe((store) => {
      this.loader = false;
      if (store && store.user) {
        this.user = store.user;
        this.vkId = store.user.vkId;
      }
    });
  }

  ngOnDestroy() {
    this.store.unsubscribe();
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
