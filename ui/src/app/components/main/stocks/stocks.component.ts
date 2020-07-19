import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit, OnDestroy {
  public loader: boolean;
  public vkId: string = null;
  private store: Subscription;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.store = this.storeService.storeObservable.subscribe((store) => {
      this.loader = false;
      if (store && store.user) {
        this.vkId = store.user.vkId;
      }
    })
    console.log('this.router.url', this.router.url);
    console.log('route', this.route);
  }

  ngOnDestroy() {
    this.store.unsubscribe();
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
