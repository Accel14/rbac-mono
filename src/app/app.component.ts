import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button (click)="makeRequest()">Сделать запрос</button>
  `
})
export class AppComponent {
    constructor(private http: HttpClient) { }

    makeRequest() {
        this.http.get('http://localhost:3000', { responseType: 'text' }).subscribe({
            next: response => console.log('Ответ от сервера:', response),
            error: err => console.error('Ошибка:', err)
        });
    }
}
