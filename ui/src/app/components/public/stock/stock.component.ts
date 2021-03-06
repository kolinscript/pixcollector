import { Component, OnDestroy, OnInit } from '@angular/core';
import { SlideUpDown } from '../../../animations';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DownloadService } from '../../../services/download.service';
import { StoreService } from '../../../services/store.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [SlideUpDown.animationTrigger]
})
export class StockComponent implements OnInit, OnDestroy {
  public id;
  public user;
  public stockUser;
  public loader: boolean;
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
  public private: boolean;
  public allowDownload: boolean;
  public privacyVisible: number;
  private store: Subscription;
  private authorized: boolean;


  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private downloadService: DownloadService,
  ) {
  }

  ngOnInit(): void {
    this.id = this.router.url.slice(7);
    this.authorized = this.authService.isAuthorized();
    this.userService.isSelfStock(this.id).subscribe((selfStockCheck) => {
      this.selfStock = selfStockCheck.body.isSelfStock;
    });
    this.loader = true;
    this.userService.getUser(this.id).subscribe((user) => {
      this.loader = false;
      if (user.body.user) {
        this.stockUser = user.body.user;
        this.href = `https://vk.com/id${this.stockUser.vkId}`;
        this.storeService.setStore({stockUser: this.stockUser});
        this.store = this.storeService.storeObservable.subscribe((store) => {
          if (store && store.user) {
            this.user = store.user;
            if (this.selfStock || (this.user.sysAccessRights === 1)) {
              this.allowDownload = true;
            }
          }
          if (store && store.stockUser) {
            if (this.stockUser.privacyDownloadable === 3 && !this.selfStock) {
              this.allowDownload = false;
            }
            if (this.stockUser.privacyDownloadable === 2 && !this.selfStock && this.authorized) {
              this.allowDownload = true;
            }
            if (this.stockUser.privacyDownloadable === 2 && !this.authorized) {
              this.allowDownload = false;
            }
            if (this.stockUser.privacyDownloadable === 1) {
              this.allowDownload = true;
            }
          }
        });
        this.stockUser.pixArray.forEach((pix) => {
          pix.hovered = false;
          pix.selected = false;
        });
      }
      if (user.body.error) {
        if (user.body.error.code === 2) {
          this.private = true;
          this.privacyVisible = 2;
        } else if (user.body.error.code === 3) {
          this.private = true;
          this.privacyVisible = 3;
        } else if (user.body.error.code === 0) {
          this.private = true;
          this.privacyVisible = 0;
        }
      }
      this.calculateLastPage();
      this.calculateViewport();
    });
  }

  ngOnDestroy() {
    // this.store.unsubscribe();
  }

  public pixHoveredStart(event, pix, i): void {
    const item = this.stockUser.pixArray.find(el => el.url === pix.url);
    item.hovered = true;
  }

  public pixHoveredEnd(event, pix, i): void {
    const item = this.stockUser.pixArray.find(el => el.url === pix.url);
    item.hovered = false;
  }

  public openViewer(event, pix, i): void {
    this.viewerPix = {
      ...this.stockUser.pixArray.find(el => el.url === pix.url),
      VKTIFSAExists: this.user ? this.user.VKTIFSAExists : false,
      num_current: this.stockUser.pixArray.indexOf(this.stockUser.pixArray.find(el => el.url === pix.url)) + 1,
      num_total: this.stockUser.pixArray.length
    };
    console.log(this.viewerPix);
    this.viewerOpened = true;
  }

  public viewerClose(): void {
    this.viewerOpened = false;
  }

  public viewerSlide(direction): void {
    const CUR_PIX_INDEX = this.stockUser.pixArray.indexOf(this.stockUser.pixArray.find(el => el.url === this.viewerPix.url));
    switch (direction) {
      case 'left': {
        if (CUR_PIX_INDEX - 1 >= 0) {
          this.viewerPix = {
            ...this.stockUser.pixArray[CUR_PIX_INDEX - 1],
            VKTIFSAExists: this.user ? this.user.VKTIFSAExists : false,
            num_current: CUR_PIX_INDEX,
            num_total: this.stockUser.pixArray.length,
          };
          console.log(this.viewerPix);
        }
        break;
      }
      case 'right': {
        if (CUR_PIX_INDEX + 1 < this.stockUser.pixArray.length) {
          this.viewerPix = {
            ...this.stockUser.pixArray[CUR_PIX_INDEX + 1],
            VKTIFSAExists: this.user ? this.user.VKTIFSAExists : false,
            num_current: CUR_PIX_INDEX + 2,
            num_total: this.stockUser.pixArray.length,
          };
        }
        console.log(this.viewerPix);
        break;
      }
    }
  }

  public pixSelectorClickHandler(event, pix, i): void {
    const item = this.stockUser.pixArray.find(el => el.url === pix.url);
    item.selected = !item.selected;
    this.selectedPixies = this.stockUser.pixArray.filter(pixItem => pixItem.selected);
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
    this.stockUser.pixArray.forEach((pix) => {
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
      this.stockUser.pixArray.forEach((pix) => {
        pix.selected = false;
      });
      this.selectedPixies = [];
      this.selectedAmount = 0;
    } else if (!this.selectAllPix) {
      this.selectAllPix = true;
      this.stockUser.pixArray.forEach((pix) => {
        pix.selected = true;
      });
      this.selectedPixies = this.stockUser.pixArray.filter(pix => pix.selected);
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
    this.paginatorPageTotal = Math.ceil(this.stockUser.pixArray.length / this.pixPerPage);
  }

  private calculateViewport(): void {
    this.pixInViewport = [];
    if (this.paginatorPageCurrent === this.paginatorPageTotal) {
      const lastPixCount = this.stockUser.pixArray.length - this.pixViewportStart;
      for (let i = this.pixViewportStart; i < (this.pixViewportStart + lastPixCount); i++) {
        this.pixInViewport.push(this.stockUser.pixArray[i]);
      }
    } else {
      for (let i = this.pixViewportStart; i < (this.pixViewportStart + this.pixPerPage); i++) {
        this.pixInViewport.push(this.stockUser.pixArray[i]);
      }
    }
  }

}
