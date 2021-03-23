import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = `${environment.api + 'image.php' + '?API_KEY=' + environment.api_key}`;

  constructor(private httpClient: HttpClient) {
  }

  public uploadImage(file: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('image', file);

    return this.httpClient.post(this.baseUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  public deleteImage(name: string): Observable<any> {

    const url = this.baseUrl + '&name=' + name;
    return this.httpClient.delete(url);
  }
}
