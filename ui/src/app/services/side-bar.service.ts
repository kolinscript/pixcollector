import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs/index';
import { SideBar } from '../models/side-bar.model';
import { last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  public sideBars: Array<any>;
  public sideBarsObservable: BehaviorSubject<any[]>;
  private sideBarResponseObj: Subject<any>;

  constructor() {
    this.sideBars = new Array<{}>();
    this.sideBarsObservable = new BehaviorSubject<any[]>(this.sideBars);
    this.sideBarResponseObj = new Subject<any>();
  }

  public openSideBar(sideBar: SideBar) {
    this.sideBars.push(sideBar);
    this.sideBarsObservable.next(this.sideBars);
    return this.sideBarResponseObj.pipe(last());
  }

  public closeSideBar() {
    this.sideBars.splice(-1, 1);
    this.sideBarsObservable.next(this.sideBars);
  }

  public closeSideAllBars() {
    this.sideBars = new Array<{}>();
    this.sideBarsObservable.next(this.sideBars);
  }

  public sideBarResponseData(data) {
    this.sideBarResponseObj.next(data);
  }
}

