import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RegisterComponent],
    template: `
    <h1>Добро пожаловать!</h1>
    <app-register></app-register>
  `
})
export class AppComponent {
    constructor(private http: HttpClient) { }

    makeRequest() {
        this.http.get('http://localhost:3000/api/users', { responseType: 'text' }).subscribe({
            next: response => console.log('Ответ от сервера:', response),
            error: err => console.error('Ошибка:', err)
        });
    }
}
