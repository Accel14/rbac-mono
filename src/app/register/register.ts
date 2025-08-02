import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, CreateUserDto } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule, RouterModule],
  template: `
    <h2>Регистрация</h2>
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

      <label>
        Имя:
        <input type="text" formControlName="name" />
      </label>
      <div *ngIf="registerForm.controls['name'].invalid && registerForm.controls['name'].touched">
        Имя обязательно
      </div>

      <label>
        Email:
        <input type="email" formControlName="email" />
      </label>
      <div *ngIf="registerForm.controls['email'].invalid && registerForm.controls['email'].touched">
        Введите корректный email
      </div>

      <label>
        Пароль:
        <input type="password" formControlName="password" />
      </label>
      <div *ngIf="registerForm.controls['password'].invalid && registerForm.controls['password'].touched">
        Пароль обязателен
      </div>

      <button type="submit" [disabled]="registerForm.invalid">Зарегистрироваться</button>
    </form>

    <div *ngIf="successMessage" style="color: green;">
      {{ successMessage }}
    </div>
    <div *ngIf="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>
  `,
})
export class RegisterComponent {
  registerForm;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value as CreateUserDto;

    this.authService.register(formValue).subscribe({
      next: () => {
        console.log(this);
        this.successMessage = 'Регистрация прошла успешно!';
        this.errorMessage = '';
        this.registerForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Ошибка регистрации: ' + (err.error?.message || err.statusText);
        this.successMessage = '';
      },
    });
  }
}
