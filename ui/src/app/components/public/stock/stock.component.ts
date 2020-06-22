import { Component, OnInit } from '@angular/core';
import { SlideUpDown } from '../../../animations';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DownloadService } from '../../../services/download.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [SlideUpDown.animationTrigger]
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
  public selfStock: boolean = true;
  public href: string = '';
  public viewerOpened: boolean = false;
  public viewerPix;


  constructor(
    private router: Router,
    private userService: UserService,
    private downloadService: DownloadService,
  ) {}

  ngOnInit(): void {
    this.id = this.router.url.slice(7);
    this.userService.getUser(this.id).subscribe((user) => {
      if (!user.body.user) {
      } else if (user.body.user) {
        const safeUser = ({ token, pixArray, ...rest }) => rest;

        this.user = user.body.user;
        this.href = `https://vk.com/id${this.user.vkId}`;

        const USER_LOCAL = JSON.parse(localStorage.getItem('user'));
        if (USER_LOCAL) { this.selfStock = this.id === USER_LOCAL.vkId; }

        this.user.pixArray.forEach((pix) => {
          pix.hovered = false;
          pix.selected = false;
        });

        console.log('user: ', this.user);

        this.calculateLastPage();
        this.calculateViewport();

        // only if looking on self page!
        // if (localStorage.getItem('token')) {
        //   localStorage.setItem('token', user.body.user.token);
        //   localStorage.setItem('user', JSON.stringify(safeUser(user.body.user)));
        // }
      }
    });
  }

  public pixHoveredStart(event, pix, i): void {
    const item = this.user.pixArray.find(el => el.url === pix.url);
    item.hovered = true;
  }

  public pixHoveredEnd(event, pix, i): void {
    const item = this.user.pixArray.find(el => el.url === pix.url);
    item.hovered = false;
  }

  public openViewer(event, pix, i): void {
    this.viewerPix = {
      ...this.user.pixArray.find(el => el.url === pix.url),
      num_current: this.user.pixArray.indexOf(this.user.pixArray.find(el => el.url === pix.url)) + 1,
      num_total: this.user.pixArray.length
    };
    console.log(this.viewerPix);
    this.viewerOpened = true;
  }

  public viewerClose(): void {
    this.viewerOpened = false;
  }

  public viewerSlide(direction): void {
    const CUR_PIX_INDEX = this.user.pixArray.indexOf(this.user.pixArray.find(el => el.url === this.viewerPix.url));
    switch (direction) {
      case 'left': {
        if (CUR_PIX_INDEX - 1 >= 0) {
          this.viewerPix = {
            ...this.user.pixArray[CUR_PIX_INDEX - 1],
            num_current: CUR_PIX_INDEX,
            num_total: this.user.pixArray.length,
          };
          console.log(this.viewerPix);
        }
        break;
      }
      case 'right': {
        if (CUR_PIX_INDEX + 1 < this.user.pixArray.length) {
          this.viewerPix = {
            ...this.user.pixArray[CUR_PIX_INDEX + 1],
            num_current: CUR_PIX_INDEX + 2,
            num_total: this.user.pixArray.length,
          };
        }
        console.log(this.viewerPix);
        break;
      }
    }
  }

  public pixSelectorClickHandler(event, pix, i): void {
    const item = this.user.pixArray.find(el => el.url === pix.url);
    item.selected = !item.selected;
    this.selectedPixies = this.user.pixArray.filter(pixItem => pixItem.selected);
    this.selectedAmount = this.selectedPixies.length;
    console.log(this.selectedPixies);
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

  public deselectClickHandler(): void {
    this.selectAllPix = false;
    this.user.pixArray.forEach((pix) => {
      pix.selected = false;
    });
    this.selectedPixies = [];
    this.selectedAmount = 0;
  }

  public pixPerPageHandler(ppp: number): void {
    this.pixPerPage = ppp;
    this.pppMode = false;
    this.paginatorPageCurrent = 1;
    this.pixViewportStart = 0;
    this.calculateLastPage();
    this.calculateViewport();
  }

  public paginatorClickHandler(direction: 'backward' | 'forward' | 'firstPage' | 'lastPage'): void {
    switch (direction) {
      case 'backward': {
        if (this.paginatorPageCurrent - 1 > 0) {
          this.paginatorPageCurrent = this.paginatorPageCurrent - 1;
          this.pixViewportStart = this.pixViewportStart - this.pixPerPage;
          this.calculateViewport();
        }
        break;
      }
      case 'forward': {
        if (this.paginatorPageCurrent < this.paginatorPageTotal) {
          this.paginatorPageCurrent = this.paginatorPageCurrent + 1;
          this.pixViewportStart = this.pixViewportStart + this.pixPerPage;
          this.calculateViewport();
        }
        break;
      }
      case 'firstPage': {
        this.paginatorPageCurrent = 1;
        this.pixViewportStart = 0;
        this.calculateViewport();
        break;
      }
      case 'lastPage': {
        this.paginatorPageCurrent = this.paginatorPageTotal;
        this.pixViewportStart = this.pixPerPage * (this.paginatorPageCurrent - 1);
        this.calculateViewport();
        break;
      }
    }
  }

  public selectAll(): void {
    if (this.selectAllPix) {
      this.selectAllPix = false;
      this.user.pixArray.forEach((pix) => {
        pix.selected = false;
      });
      this.selectedPixies = [];
      this.selectedAmount = 0;
    } else if (!this.selectAllPix) {
      this.selectAllPix = true;
      this.user.pixArray.forEach((pix) => {
        pix.selected = true;
      });
      this.selectedPixies = this.user.pixArray.filter(pix => pix.selected);
      this.selectedAmount = this.selectedPixies.length;
    }
  }

  public download(): void {
    this.downloadService.downloadZip(this.selectedPixies).subscribe(
      data => {
        saveAs(data, 'pixcollector.zip');
      },
      err => {
        alert("Problem while downloading the file.");
        console.error(err);
      }
    );
  }

  private calculateLastPage(): void {
    this.paginatorPageTotal =  Math.ceil(this.user.pixArray.length / this.pixPerPage);
  }

  private calculateViewport(): void {
    this.pixInViewport = [];
    if (this.paginatorPageCurrent === this.paginatorPageTotal) {
      const lastPixCount = this.user.pixArray.length - this.pixViewportStart;
      for (let i = this.pixViewportStart; i < (this.pixViewportStart + lastPixCount); i++) {
        this.pixInViewport.push(this.user.pixArray[i]);
      }
    } else {
      for (let i = this.pixViewportStart; i < (this.pixViewportStart + this.pixPerPage); i++) {
        this.pixInViewport.push(this.user.pixArray[i]);
      }
    }
  }

}
