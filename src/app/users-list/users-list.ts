// users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Все пользователи</h2>
    <div *ngIf="users; else loading">
      <ul>
        <li *ngFor="let user of users">
          <button (click)="viewProfile(user.id)">Просмотреть профиль</button>
          ID: {{ user.id }}, Email: {{ user.email }}, Роль: {{ user.role }}
        </li>
      </ul>
    </div>
    <ng-template #loading>
      <p>Загрузка...</p>
    </ng-template>
  `
})
export class UsersListComponent implements OnInit {
  users: any[] | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) return;

    this.http.get<any[]>('http://localhost:3000/api/users').subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Ошибка загрузки пользователей', err)
    });
  }

  viewProfile(userId: number) {
    this.router.navigate(['/users', userId])
  }
}