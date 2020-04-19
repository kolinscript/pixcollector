import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './services/auth.service';

import { AuthComponent } from './components/auth/auth.component';
import { StockComponent } from './components/public/stock/stock.component';
import { MainComponent } from './components/main/main.component';
import { StocksComponent } from './components/main/stocks/stocks.component';
import { ChartComponent } from './components/main/chart/chart.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'auth/success', component: AuthComponent },
  { path: 'stock/:id', component: StockComponent },
  { path: '', canActivate: [AuthService], component: MainComponent,
    children: [
      { path: 'stocks', component: StocksComponent },
      { path: 'chart', component: ChartComponent },
      { path: '', redirectTo: 'stocks', pathMatch: 'full' },
      { path: '**', redirectTo: 'stocks', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
