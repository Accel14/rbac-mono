import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BACKEND_API } from '../constants';
import { UsersService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  template: `
  <h2>Профиль пользователя</h2>
  @if (user) {
    <div>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Имя:</strong> {{ user.name }}
        <p><strong>Роль:</strong> {{ user.role }}</p>
        @if (user.role === 'admin') {
          <button>Сменить роль</button>
        }
    </div>
  }

  @else {
    <p>Загрузка данных...</p>
    }

  @if (user.role === 'admin') {
  <a routerLink="/users">Список всех пользователей</a>
  }
  
  `,
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    const id = this.authService.getUserIdFromToken();
    console.log(id);
    if (!id) return;

    this.usersService.getUserById(id).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Ошибка загрузки профиля', err),
      complete: () => console.log('Запрос завершен'),
    });

    // this.http.get(`${BACKEND_API}/api/users/${id}`).subscribe({
    //   next: (data) => {
    //     console.log('Данные пользователя:', data);
    //     this.user = data;
    //   },
    //   error: (err) => console.error('Ошибка загрузки профиля', err),
    //   complete: () => {
    //     console.log('Запрос завершён');
    //   }
    // });

  }

}
