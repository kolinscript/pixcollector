import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  public id =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).vkId : null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public goToStock(dest): void {
    dest === 'all' ? this.router.navigate(['/chart']) : this.router.navigate([`/stock/${dest}`]);
  }
}
