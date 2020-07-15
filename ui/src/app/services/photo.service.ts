import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private http: HttpClient
  ) { }

  public vkSave(owner_id: number, photo_id: number): Observable<any> {
    return this.http.post('/api/v1/vk-photo/save', { owner_id: owner_id, photo_id: photo_id });
  }
}
