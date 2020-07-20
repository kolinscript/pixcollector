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

  public vkSave(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const link = `https://api.vk.com/` +
      `method/photos.copy` +
      `?access_token=${vkTokenIF}` +
      `&owner_id=${owner_id}` +
      `&photo_id=${photo_id}` +
      `&v=5.120`;
    return this.http.get(link);
  }

  public vkLike(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const link = `https://api.vk.com/` +
      `method/likes.add` +
      `?access_token=${vkTokenIF}` +
      `&owner_id=${owner_id}` +
      `&item_id=${photo_id}` +
      `&type=photo` +
      `&v=5.120`;
    return this.http.get(link);
  }
}
