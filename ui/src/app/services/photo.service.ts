import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private http: HttpClient
  ) {
  }

  public vkSave(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const URL = `https://api.vk.com/` +
      `method/photos.copy` +
      `?access_token=${vkTokenIF}` +
      `&owner_id=${owner_id}` +
      `&photo_id=${photo_id}` +
      `&v=5.120`;
    const HEADERS = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Skip-Token', 'true');
    return this.http.get(`${URL}`, {headers: HEADERS, withCredentials: true, params: {mode: 'no-cors'}});
  }

  public vkLike(owner_id: number, photo_id: number, vkTokenIF: string,): Observable<any> {
    const URL = `https://api.vk.com/` +
      `method/likes.add` +
      `?owner_id=${owner_id}` +
      `&item_id=${photo_id}` +
      `&type=photo` +
      `&access_token=${vkTokenIF}` +
      `&v=5.120`;
    const HEADERS = new HttpHeaders()
      .set('Skip-Token', 'true');
    return this.http.get(`${URL}`, {headers: HEADERS, withCredentials: true, params: {mode: 'no-cors'}});
  }
}
