import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService, CreateUserDto } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})

export class RegisterComponent {
  registerForm;
  message: string = '';
  formData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

        // Переадресация на профиль после успешной регистрации
        this.authService.login(formValue.email, formValue.password).subscribe({
          next: (res) => {
            this.authService.saveToken(res.access_token);
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.errorMessage = 'Ошибка входа: ' + (err.error?.message || err.statusText);
          }
        });

      },
      error: (err) => {
        this.errorMessage = 'Ошибка регистрации: ' + (err.error?.message || err.statusText);
        this.successMessage = '';
      },
    });
  }
}
