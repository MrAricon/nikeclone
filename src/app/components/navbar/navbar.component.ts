import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-white border-b">
      <div class="flex justify-end gap-4 px-4 py-2 bg-gray-100 text-sm">
        <a href="#" class="hover:text-gray-600">Buscar una tienda</a>
        <a href="#" class="hover:text-gray-600">Ayuda</a>
        <a href="#" class="hover:text-gray-600">Únete a nosotros</a>
        <a href="#" class="hover:text-gray-600">Iniciar sesión</a>
      </div>

      <div class="flex items-center justify-between px-4 py-2">
        <a routerLink="/" class="flex-shrink-0">
          <svg class="h-20 w-20 my-[-20px]" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="evenodd" 
          d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 
          0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 
          1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 
          .829-.063 1.316-.19L21 8.719z" clip-rule="evenodd"></path>
          </svg>
        </a>

        <div class="hidden lg:flex items-center gap-8">
          <a routerLink="/" class="hover:underline">Home</a>
          <a routerLink="/products" class="hover:underline">Productos</a>
          <a routerLink="/admin" class="hover:underline">Admin</a>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
          <svg class="absolute left-3 top-7 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
          viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"></path>
          </svg>
            <input 
              type="search" 
              placeholder="Buscar" 
              class="pl-10 pr-4 py-2 rounded-full bg-gray-100"
            >
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent { }