import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://paucano.ddns.net/nikecloneapi/api.php';
  private _products = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?products`, { headers: this.getHeaders() })
      .pipe(tap((data) => this._products.next(data)));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      tap(products => {
        if (products.length === 0) this.getProducts().subscribe();
      }),
      map(products => products.find(p => p.id === id))
    );
  }

  addProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}?add_product`, newProduct, { headers: this.getHeaders() })
      .pipe(
        tap(product => this._products.next([...this._products.value, product]))
      );
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}?update_product`, updatedProduct, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.getProducts().subscribe())
      );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?delete_product=${productId}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this._products.next(this._products.value.filter(p => p.id !== productId)))
      );
  }
}