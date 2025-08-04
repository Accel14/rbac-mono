import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RegisterComponent, LoginComponent, RouterOutlet],
    template: `
    <h1>Добро пожаловать!</h1>
    <a href="#" (click)="logout()" >Выйти</a>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
    constructor(private http: HttpClient, private authService: AuthService,
        private router: Router
    ) { }


    logout() {
        this.authService.logout();
        this.router.navigate(['/login'])
    }

    makeRequest() {
        this.http.get('http://localhost:3000/api/users', { responseType: 'text' }).subscribe({
            next: response => console.log('Ответ от сервера:', response),
            error: err => console.error('Ошибка:', err)
        });
    }
}
