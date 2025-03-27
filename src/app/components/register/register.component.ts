import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="max-w-md mx-auto mt-10 p-6 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold text-center">Register</h2>

      <div>
        <label class="block text-sm font-medium">Username</label>
        <input 
          type="text" 
          formControlName="username" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-300"
          [class.border-red-500]="username.invalid && username.touched"
        />
        <p *ngIf="username.invalid && username.touched" class="text-red-500 text-sm">Username is required.</p>
      </div>

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
        [disabled]="registerForm.invalid"
        class="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        Register
      </button>
    </form>
  `
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.registerForm.get('username')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, password, email } = this.registerForm.value;

      this.authService.register(username, password, email).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Error: Registration failed.');
        }
      });
    }
  }
}
