import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private http: HttpClient
  ) { }

  public downloadZip(selectedPixies: object[]): Observable<any> {
    return this.http.post('/api/v1/download/pixcollector.zip', { selected_pixies: selectedPixies }, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
}
