import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
  }

  public vkSave(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const HEADERS = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Origin', 'https://pixcollector.herokuapp.com')
      .set('Skip-Token', 'true');
    const URL = `https://api.vk.com/method/photos.copy?access_token=${vkTokenIF}&owner_id=${owner_id}&photo_id=${photo_id}&v=5.120`;
    return this.http.get(`${URL}`, {headers: HEADERS});
  }

  public vkLike(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    return this.http.post(`/api/v1/vk-photo/like`, {owner_id: owner_id, photo_id: photo_id, vkTokenIF: vkTokenIF});
  }
}
