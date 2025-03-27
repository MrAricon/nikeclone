import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="loading" class="text-center p-4">Loading product...</div>
<div class="max-w-2xl mx-auto p-6">
    <form *ngIf="!loading" [formGroup]="productForm" (ngSubmit)="onSubmit()">
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
          <label class="block text-sm font-medium">Image</label>
          <input type="file" (change)="uploadImage($event)" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div *ngIf="productForm.get('imageUrl')?.value">
          <img [src]="productForm.get('imageUrl')?.value" alt="Uploaded Image" class="mt-2 w-32 h-32 object-cover">
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
    <br>
    <button 
      (click)="deleteProduct()"
      *ngIf="isEditing"
      class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
    >
      Delete Product
    </button>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;
  uploadUrl = 'http://paucano.ddns.net/images/upload.php';
  loading = false;
  productId?: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      id: [''],
      serialNumber: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      imageUrl: [''],
      inStock: [true],
      colors: [''],
      sizes: ['']
    });
  }

  ngOnInit() {
    console.log(this.authService.getRoles());
  
    if (this.authService.getRoles() !== '1') {
      this.router.navigate(['/home']);
    }
  
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.productId = id || undefined;
        if (id) {
          this.isEditing = true;
          this.loading = true;
          return this.productService.getProductById(id);
        }
        return of(null);
      })
    ).subscribe(product => {
      if (product) {
        const colors = Array.isArray(product.colors) ? product.colors.join(', ') : '';
        const sizes = Array.isArray(product.sizes) ? product.sizes.join(', ') : '';
        
        this.productForm.patchValue({
          ...product,
          imageUrl: product.image_url,
          colors: colors,
          sizes: sizes,
          serialNumber: product.id
        });
      }
      this.loading = false;
    }, error => {
      console.error('Error fetching product:', error);
      this.loading = false;
    });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
  
    if (!file) {
      return;
    }
  
    const formData = new FormData();
    formData.append('fileToUpload', file);
  
    this.http.post(this.uploadUrl, formData, { responseType: 'text' })
      .subscribe((response: any) => {
        const imageUrl = `${this.uploadUrl.replace('upload.php', '')}${file.name}`;
        this.productForm.patchValue({ imageUrl });
      }, error => {
        console.error('Image upload failed:', error);
      });
  }
  
  deleteProduct() {
    if (this.productId) {
      this.productService.deleteProduct(this.productId);
      this.productService.getProducts();
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
      
      let action$: Observable<Product>;

      if (this.isEditing) {
        action$ = this.productService.updateProduct(product);
      } else {
        action$ = this.productService.addProduct(product);
      }

      action$.subscribe(() => this.router.navigate(['/products']));
    }
  }
}
