import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './app-interceptor.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { StockComponent } from './components/public/stock/stock.component';
import { MainComponent } from './components/main/main.component';
import { StocksComponent } from './components/main/stocks/stocks.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ChartComponent } from './components/main/chart/chart.component';
import { ViewerComponent } from './components/shared/viewer/viewer.component';
import { SideBarComponent } from './components/shared/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MainComponent,
    StockComponent,
    StocksComponent,
    HeaderComponent,
    FooterComponent,
    ChartComponent,
    ViewerComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
