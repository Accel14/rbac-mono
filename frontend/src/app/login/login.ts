import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule
  ],
  template: `
    <h2>Вход</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="row">

        <div class="col">
          <mat-form-field class="full-width">
            <input matInput placeholder="Email" formControlName="email">
            @if (loginForm.controls['email'].hasError('required')) {
              <mat-error>First name is <strong>required</strong></mat-error>
            }
          </mat-form-field>
        </div>

        <div class="col">
          <mat-form-field class="full-width">
            <input matInput placeholder="Password" formControlName="password">
            @if (loginForm.controls['password'].hasError('required')) {
              <mat-error>Password is <strong>required</strong></mat-error>
            }
          </mat-form-field>
        </div>
        
      </div>

      <button matButton="filled" type="submit" [disabled]="loginForm.invalid">Войти</button>

      <button matButton="filled" routerLink="/register">Зарегистрироваться</button>
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
