// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Product): void {
    product.id = Date.now().toString(); // Simple ID generation
    product.createdAt = new Date();
    product.updatedAt = new Date();
    this.products.push(product);
    this.productsSubject.next([...this.products]);
  }

  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      updatedProduct.updatedAt = new Date();
      this.products[index] = updatedProduct;
      this.productsSubject.next([...this.products]);
    }
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductBySerialNumber(serialNumber: string): Product | undefined {
    return this.products.find(p => p.serialNumber === serialNumber);
  }
}