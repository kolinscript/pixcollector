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
    const link = `https://api.vk.com/` +
      `method/likes.add` +
      `?owner_id=${owner_id}` +
      `&item_id=${photo_id}` +
      `&type=photo` +
      `&access_token=${vkTokenIF}` +
      `&v=5.120`;
    return this.http.get(`${link}`);
  }
}
