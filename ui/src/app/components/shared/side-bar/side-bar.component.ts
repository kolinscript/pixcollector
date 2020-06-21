import { Component, ElementRef, OnInit } from '@angular/core';
import { SideBarService } from '../../../services/side-bar.service';
import { SideBarTypes } from 'src/app/models/side-bar.model';
import { SlideRightLeft } from '../../../animations';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [SlideRightLeft.animationTrigger]
})
export class SideBarComponent implements OnInit {
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
