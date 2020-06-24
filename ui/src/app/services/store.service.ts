import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private store: Store;
  public storeObservable: BehaviorSubject<Store>;

  constructor() {
    this.store = JSON.parse(localStorage.getItem('store'));
    this.storeObservable = new BehaviorSubject<Store>(this.store);
  }

  public setStore(newStore: Store) {
    this.store = {
      ...this.store,
      ...newStore
    };
    localStorage.setItem('store', JSON.stringify(this.store));
    this.storeObservable.next(this.store);
  }

  public removeStore() {
    this.store = {}
    localStorage.removeItem('store');
    this.storeObservable.complete();
  }
}



