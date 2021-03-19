import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrlUpload = `${environment.api + 'uploadImage.php' + '?API_KEY=' + environment.api_key}`;
  private baseUrlDelete = `${environment.api + 'deleteImage.php' + '?API_KEY=' + environment.api_key}`;

  constructor(private httpClient: HttpClient) {
  }

  public uploadImage(file: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('image', file);

    return this.httpClient.post(this.baseUrlUpload, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  public deleteImage(name: string): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);

    return this.httpClient.delete(this.baseUrlDelete, formData);
  }
}
