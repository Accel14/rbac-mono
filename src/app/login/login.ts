import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, RouterModule],
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    const formValue = this.loginForm.value;

    this.http.post('http://localhost:3000/api/auth/login', formValue).subscribe({
      next: (res) => {
        this.successMessage = 'Вход прошел успешно!';
        this.errorMessage = '';
        this.loginForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка входа: ' + (err.error?.message || err.statusText);
        this.successMessage = '';
      },
    });
  }
}
