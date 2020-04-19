import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUser(id: string): Observable<any> {
    return this.http
      .get(`/api/v1/user?id=${id}`)
      .pipe(map(res => res as any));
  }

  getPublicUsers(): Observable<any> {
    return this.http
      .get(`/api/v1/users`)
      .pipe(map(res => res as any));
  }
}
