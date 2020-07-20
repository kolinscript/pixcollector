import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http
      .get(`https://api.vk.com/method/photos.copy?access_token=${vkTokenIF}&owner_id=${owner_id}&photo_id=${photo_id}&v=5.120`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Skip-Token': 'true',
          }
        }
      );
  }

  public vkLike(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    return this.http.post(`/api/v1/vk-photo/like`, {owner_id: owner_id, photo_id: photo_id, vkTokenIF: vkTokenIF});
  }
}
