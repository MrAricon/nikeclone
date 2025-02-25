import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'admin', component: ProductFormComponent },
  { path: '**', redirectTo: '' }
];