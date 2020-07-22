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
    return this.http.post(
      `/api/v1/vk-photo/save`,
      {owner_id: owner_id, photo_id: photo_id, vkTokenIF: vkTokenIF}
    );
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
      .set('Access-Control-Allow-Origin', 'pixcollector.herokuapp.com')
      .set('Origin', 'https://pixcollector.herokuapp.com')
      .set('Skip-Token', 'true');
    return this.http.get(`${URL}`, {headers: HEADERS});
  }
}
