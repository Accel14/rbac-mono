import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <h2>Вход</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label>
        Email:
        <input type="email" formControlName="email" />
      </label>
      @if (loginForm.controls['email'].invalid && loginForm.controls['email'].touched) {
      <div>
        Введите корректный email
      </div>
      }
      

      <label>
        Пароль:
        <input type="password" formControlName="password" />
      </label>
      @if (loginForm.controls['password'].invalid && loginForm.controls['password'].touched) {
      <div>
        Введите корректный пароль
      </div>
      }
      

      <button type="submit" [disabled]="loginForm.invalid">Войти</button>
    </form>

    @if (successMessage) {
    <div style="color: green;">
      {{ successMessage }}
    </div>
    }
    
    @if (errorMessage) {
    <div style="color: red;">
      {{ errorMessage }}
    </div>
    }
    <a routerLink="/register">Зарегистрироваться</a>
  `,
  styleUrl: './login.css'
})
export class Login {
  loginForm;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (res) => {
        console.log(this);
        this.authService.saveToken(res.access_token);
        this.successMessage = 'Вход прошел успешно!';
        this.loginForm.reset();
        this.router.navigate(['/users', this.authService.getFromToken('sub')])
      },
      error: (err) => {
        this.errorMessage = 'Ошибка входа: ' + (err.error?.message || err.statusText);
      },
    });
  }
}
