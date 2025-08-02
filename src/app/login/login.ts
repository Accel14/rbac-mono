import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, CreateUserDto } from '../services/auth.service';
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
      <div *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched">
        Введите корректный email
      </div>

      <label>
        Пароль:
        <input type="password" formControlName="password" />
      </label>
      <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched">
      </div>

      <button type="submit" [disabled]="loginForm.invalid">Войти</button>
    </form>

    <div *ngIf="successMessage" style="color: green;">
      {{ successMessage }}
    </div>
    <div *ngIf="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>
    <a routerLink="/register">Зарегистрироваться</a>
  `,
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {
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
        this.errorMessage = '';
        this.loginForm.reset();
        this.router.navigate(['/profile'])

      },
      error: (err) => {
        this.errorMessage = 'Ошибка входа: ' + (err.error?.message || err.statusText);
        this.successMessage = '';
      },
    });
  }
}
