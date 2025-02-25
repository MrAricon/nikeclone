import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="max-w-2xl mx-auto p-6">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium">Serial Number</label>
          <input type="text" formControlName="serialNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label class="block text-sm font-medium">Product Name</label>
          <input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label class="block text-sm font-medium">Price</label>
          <input type="number" formControlName="price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label class="block text-sm font-medium">Description</label>
          <textarea formControlName="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">Category</label>
          <select formControlName="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Image URL</label>
          <input type="text" formControlName="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label class="block text-sm font-medium">In Stock</label>
          <input type="checkbox" formControlName="inStock" class="mt-1 rounded">
        </div>
        <div>
          <label class="block text-sm font-medium">Colors (comma-separated)</label>
          <input type="text" formControlName="colors" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label class="block text-sm font-medium">Sizes (comma-separated)</label>
          <input type="text" formControlName="sizes" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <button 
          type="submit" 
          [disabled]="!productForm.valid"
          class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
        >
          {{ isEditing ? 'Update' : 'Add' }} Product
        </button>
      </div>
    </form>
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      id: [''],
      serialNumber: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      inStock: [true],
      colors: [''],
      sizes: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      const product = this.productService.getProductById(id);
      if (product) {
        this.productForm.patchValue({
          ...product,
          colors: product.colors.join(', '),
          sizes: product.sizes.join(', ')
        });
      }
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product: Product = {
        ...formValue,
        colors: formValue.colors.split(',').map((color: string) => color.trim()),
        sizes: formValue.sizes.split(',').map((size: string) => size.trim())
      };
      
      if (this.isEditing) {
        this.productService.updateProduct(product);
      } else {
        this.productService.addProduct(product);
      }
      this.router.navigate(['/products']);
    }
  }
}