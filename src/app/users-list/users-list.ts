import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User, UsersService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  // template: `
  //   <h2>Все пользователи</h2>
  //   <div *ngIf="users; else loading">
  //     <ul>
  //       <li *ngFor="let user of users">
  //         <button (click)="viewProfile(user.id)">Просмотреть профиль</button>
  //         ID: {{ user.id }}, Email: {{ user.email }}, Роль: {{ user.role }}
  //       </li>
  //     </ul>
  //   </div>
  //   <ng-template #loading>
  //     <p>Загрузка...</p>
  //   </ng-template>
  // `
  template: `
    <h2>Все пользователи</h2>
    @if (users) {
      <div>
        <ul>
          @for (user of users; track user.id) {
          <li>
            <button (click)="viewProfile(user.id)">Просмотреть профиль</button>
            ID: {{ user.id }}, Email: {{ user.email }}, Роль: {{ user.role }}
          </li>
          }
        </ul>
      </div>
    }
    @else {
      <ng-template>
      <p>Загрузка...</p>
    </ng-template>
    }
  `
})
export class UsersList implements OnInit {
  users: User[] | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    const token = this.authService.getToken();
    if (!token) return;
    this.usersService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Ошибка загрузки пользователей', err)
    });
  }

  viewProfile(userId: number) {
    this.router.navigate(['/users', userId])
  }
}