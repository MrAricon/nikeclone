import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="max-w-md mx-auto mt-10 p-6 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold text-center">Login</h2>
      
      <div>
        <label class="block text-sm font-medium">Email</label>
        <input 
          type="email" 
          formControlName="email" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          [class.border-red-500]="email.invalid && email.touched"
        />
        <p *ngIf="email.invalid && email.touched" class="text-red-500 text-sm">Please enter a valid email.</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium">Password</label>
        <input 
          type="password" 
          formControlName="password" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          [class.border-red-500]="password.invalid && password.touched"
        />
        <p *ngIf="password.invalid && password.touched" class="text-red-500 text-sm">Password must be at least 6 characters.</p>
      </div>
      
      <button 
        type="submit" 
        [disabled]="loginForm.invalid"
        class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        Login
      </button>
    </form>
  `
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          if (this.authService.getToken()) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    }
  }
}
