import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public id;
  public user;
  public pixPerPage: number = 50;
  public pppMode: boolean = false;
  public selectMode: boolean = false;
  public selectedPixies: object[] = [];
  public selectedAmount: number = 0;
  public pixInViewport: object[] = [];
  public pixViewportStart: number = 0;
  public selectAllPix: boolean = false;
  public paginatorPageCurrent: number = 1;
  public paginatorPageTotal: number = 1;


  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.slice(7);
    this.userService.getUser(this.id).subscribe((user) => {
      if (!user.body.user) {
      } else if (user.body.user) {
        const safeUser = ({ token, pixArray, ...rest }) => rest;

        this.user = user.body.user;

        this.user.pixArray.forEach((pix) => {
          pix.hovered = false;
          pix.selected = false;
        });

        console.log('user: ', this.user);

        this.calculateLastPage();
        this.calculateViewport();

        if (localStorage.getItem('token')) {
          localStorage.setItem('token', user.body.user.token);
          localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
        }
      }
    });
  }

  public pixHoveredStart(event, pix, i): void {
    this.user.pixArray[i].hovered = true;
  }

  public pixHoveredEnd(event, pix, i): void {
    this.user.pixArray[i].hovered = false;
  }

  public pixSelectorClickHandler(event, pix, i): void {
    const item = this.user.pixArray.find(el => el.url === pix.url);
    item.selected = !item.selected;
    this.selectedPixies = this.user.pixArray.map(pix => pix.selected);
    this.selectedAmount = this.selectedPixies.length;
    console.log('selectedPixies: ', this.selectedPixies);
    console.log('selectedAmount: ', this.selectedAmount);
  }

  public pppClickHandler(): void {
    if (this.pppMode) {
      this.pppMode = false;
      this.selectMode = false;
    } else {
      this.pppMode = true;
      this.selectMode = false;
    }
  }

  public selectClickHandler(): void {
    if (this.selectMode) {
      this.pppMode = false;
      this.selectMode = false;
    } else {
      this.pppMode = false;
      this.selectMode = true;
    }
  }

  public pixPerPageHandler(ppp: number): void {
    this.pixPerPage = ppp;
    this.pppMode = false;
    this.calculateLastPage();
    this.calculateViewport();
  }

  public paginatorClickHandler(direction: 'backward' | 'forward'): void {
    switch (direction) {
      case 'backward': {
        if (this.paginatorPageCurrent - 1 >= 0) {
          this.paginatorPageCurrent = this.paginatorPageCurrent - 1;
          this.pixViewportStart = this.pixViewportStart + this.pixPerPage;
        }
        break;
      }
      case 'forward': {
        this.paginatorPageCurrent = this.paginatorPageCurrent + 1;
        this.pixViewportStart = this.pixViewportStart - this.pixPerPage;
        break;
      }
    }
    this.calculateViewport();
  }

  public selectAll(): void {
    if (this.selectAllPix) {
      this.selectAllPix = false;
      this.user.pixArray.forEach((pix) => {
        pix.selected = false;
      });
    } else if (!this.selectAllPix) {
      this.selectAllPix = true;
      this.user.pixArray.forEach((pix) => {
        pix.selected = true;
      });
    }
  }

  private calculateLastPage(): void {
    this.paginatorPageTotal =  Math.ceil(this.user.albumSize / this.pixPerPage);
    console.log(this.paginatorPageTotal);
  }

  private calculateViewport(): void {
    this.pixInViewport = [];
    for (let i = this.pixViewportStart; i < (this.pixViewportStart + this.pixPerPage); i++) {
      this.pixInViewport.push(this.user.pixArray[i]);
    }
    console.log('pixInViewport: ', this.pixInViewport);
  }

}
