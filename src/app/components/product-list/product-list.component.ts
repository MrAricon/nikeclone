// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Products</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of products" class="border rounded-lg overflow-hidden shadow-lg">
          <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-64 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-gray-600 mb-2">{{ product.description }}</p>
            <p class="text-lg font-bold">€{{ product.price.toFixed(2) }}</p>
            <a [routerLink]="['/products/edit', product.id]" class="text-blue-500 hover:underline">Edit</a>
          </div>
        </div>
      </div>
      <a routerLink="/admin" class="mt-6 inline-block bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
        Add New Product
      </a>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
}