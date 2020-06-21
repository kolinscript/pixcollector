import { Component, ElementRef, OnInit } from '@angular/core';
import { SideBarService } from '../../../services/side-bar.service';
import { SideBarTypes } from 'src/app/models/side-bar.model';
import { SlideRightLeft } from '../../../animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [SlideRightLeft.animationTrigger]
})
export class SidebarComponent implements OnInit {
  SideBarTypes = SideBarTypes;
  sidebars: any[];

  constructor(
    private sideBar: SideBarService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.sideBar.sideBarsObservable.subscribe((sideBars) => {
      this.sidebars = sideBars;
      console.log(sideBars);
      if (sideBars.length > 0) {
        this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
      } else {
        this.elRef.nativeElement.ownerDocument.body.style.overflow = null;
      }
    });
  }

}
