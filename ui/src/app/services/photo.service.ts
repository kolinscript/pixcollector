import { Injectable, Sanitizer } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafePipe } from '../pipes/safe.pipe';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private http: HttpClient,
    private sanitizer: Sanitizer,
    private safe: SafePipe
  ) {
  }

  public vkSave(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const link = `https://api.vk.com/` +
      `method/photos.copy` +
      `?access_token=${vkTokenIF}` +
      `&owner_id=${owner_id}` +
      `&photo_id=${photo_id}` +
      `&v=5.120`;
    return this.http.get(this.sanitizer.sanitize(SecurityContext.URL, link), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'skip_token': 'true',
      }
    });
  }

  public vkLike(owner_id: number, photo_id: number, vkTokenIF: string): Observable<any> {
    const link = `https://api.vk.com/` +
      `method/likes.add` +
      `?access_token=${vkTokenIF}` +
      `&owner_id=${owner_id}` +
      `&item_id=${photo_id}` +
      `&type=photo` +
      `&v=5.120`;
    return this.http.get(this.sanitizer.sanitize(SecurityContext.URL, link), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'skip_token': 'true',
      }
    });
  }
}
