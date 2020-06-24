import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit, OnDestroy {
  public vkId: string = null;
  private store: Subscription;

  constructor(
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store = this.storeService.storeObservable.subscribe((store) => {
      if (store && store.user) {
        this.vkId = store.user.vkId;
      }
    })
  }

  ngOnDestroy() {
    this.store.unsubscribe();
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
