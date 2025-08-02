import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
  <h2>Профиль пользователя</h2>
  <div *ngIf="user; else loading">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Имя:</strong> {{ user.name }}
      <p><strong>Роли:</strong> {{ user.role }}</p>
  </div>
  <ng-template #loading>
      <p>Загрузка данных...</p>
  </ng-template>
  `,
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    const id = this.authService.getUserIdFromToken();
    console.log(id);
    if (!id) return;

    this.http.get(`http://localhost:3000/api/users/${id}`).subscribe({
      next: (data) => {
        console.log('Данные пользователя:', data);
        this.user = data;
      },
      error: (err) => console.error('Ошибка загрузки профиля', err),
      complete: () => {
        console.log('Запрос завершён');
      }
    });

  }

}
