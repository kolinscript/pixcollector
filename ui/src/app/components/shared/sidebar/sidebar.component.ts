import { Component, ElementRef, OnInit } from '@angular/core';
import { SideBarService } from '../../../services/side-bar.service';
import { SideBarTypes } from 'src/app/models/side-bar.model';
import { ShadowInOut, SlideRightLeft } from '../../../animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [ShadowInOut.animationTrigger, SlideRightLeft.animationTrigger]
})
export class SidebarComponent implements OnInit {
  SideBarTypes = SideBarTypes;
  sidebars: any[];
  responseData: any;
  loading: boolean;

  constructor(
    public sideBar: SideBarService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.sideBar.sideBarsObservable.subscribe((sideBars) => {
      this.sidebars = sideBars;
      if (sideBars.length > 0) {
        this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
      } else {
        this.elRef.nativeElement.ownerDocument.body.style.overflow = null;
      }
    });
  }

  public sbData(data) {
    if (data && data.loading) {
      this.loading = data.loading;
    } else {
      this.loading = false;
    }
    this.responseData = data;
  }

  public sideBarClose(): void {
    if (!this.loading) {
      this.sideBar.sideBarResponseData(this.responseData);
      this.sideBar.closeSideBar();
    }
  }

}
