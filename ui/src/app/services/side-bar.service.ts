import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';
import { SideBar } from '../models/side-bar.model';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  public sideBars: Array<any>;
  public sideBarsObservable: BehaviorSubject<any[]>;

  constructor() {
    this.sideBars = new Array<{}>();
    this.sideBarsObservable = new BehaviorSubject<any[]>(this.sideBars);
  }

  public openSideBar(sideBar: SideBar) {
    this.sideBars.push(sideBar);
    this.sideBarsObservable.next(this.sideBars);
    // return SideBarRef;
  }

  public closeSideBar() {
    this.sideBars.splice(-1, 1);
    this.sideBarsObservable.next(this.sideBars);
  }

  public closeSideAllBars() {
    this.sideBars = new Array<{}>();
    this.sideBarsObservable.next(this.sideBars);
  }
}

