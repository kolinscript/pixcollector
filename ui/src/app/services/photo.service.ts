import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { vkSDK } from 'src/assets/scripts/vk-sdk.js';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  vkSdk = vkSDK;

  constructor(
    private http: HttpClient
  ) {
  }

  public vkSave(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    this.vkSdk.VK.init(() => {
      this.vkSdk.VK.api('photos.copy', {'access_token': vkTokenIF, 'owner_id': owner_id, 'photo_id': photo_id}, (res) => {
        console.log('res', res);
      });
    }, (err) => {
      console.log('err', err);
    }, '5.120');
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
