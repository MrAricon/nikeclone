import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <div class="relative h-auto overflow-hidden">
        <img 
          src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_1629,c_limit/51e31725-f519-4618-a5ba-d4164965200c/nike-just-do-it.jpg" 
          alt="Nike Hero" 
          class="w-full h-full object-cover"
        >
      </div>

      <section class="py-16 mx-10">
        <h2 class="text-2xl font-bold mb-8 px-4">Lo mejor y más nuevo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div *ngFor="let product of featuredProducts" class="border rounded-lg overflow-hidden shadow-lg">
            <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-64 object-cover">
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 mb-2">{{ product.description }}</p>
              <p class="text-lg font-bold">€{{ product.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 3); // Show up to 3 featured products
    });
  }
}