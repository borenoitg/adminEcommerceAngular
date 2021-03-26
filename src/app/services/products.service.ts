import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Response} from '../models/response';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = `${environment.api + 'products?' + 'API_KEY=' + environment.api_key}`;
  private baseUrlUpdate = `${environment.api + 'updateProducts.php' + '?API_KEY=' + environment.api_key}`;

  constructor(private http: HttpClient) {
  }

  /**
   * Permet de récupérer tous les produits
   * @return Observable de type @link Response
   */
  public getProducts(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl);
  }

  public addProduct(product: Product): Observable<Response> {
    const params = new FormData();

    params.append('name', product.name);
    params.append('description', product.description);
    params.append('price', `${product.price}`);
    params.append('stock', `${product.stock}`);
    params.append('category', `${product.Category}`);
    params.append('image', product.image);

    return this.http.post<Response>(this.baseUrl, params);
  }

  public editProduct(product: Product): Observable<Response> {
    const url = this.baseUrlUpdate + this.constructURLParams(product);
    return this.http.get<Response>(url);

  }

  constructURLParams = (object) => {
    let result = '';

    if (object) {
      for (const property in object) {
        result += `&${property}=${object[property]}`;
      }
    }

    return result;
  }
}
