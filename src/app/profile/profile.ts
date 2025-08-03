import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule, ActivatedRoute } from '@angular/router';
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

  @if (currentRole === 'admin') {
    <a routerLink="/users">Список всех пользователей</a>
    @if (currentId !== user.id) {
      <button (click)="deleteUser(user.id)">Удалить пользователя</button>
    }
  }
  
  `,
  styleUrls: ['./profile.css']
})

export class Profile implements OnInit {
  user: any = null;
  currentId: number | null = 0;
  currentRole: any = null;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    const routeId = this.route.snapshot.paramMap.get('id');
    const subFromToken = this.authService.getFromToken('sub');
    const roleFromToken = this.authService.getFromToken('role');
    console.log(`routeId: ${routeId}, subFromToken: ${subFromToken}, roleFromToken: ${roleFromToken}`);

    if (subFromToken === null) {
      console.error('Пользователь не авторизован');
      return;
    }

    this.currentId = subFromToken;
    this.currentRole = roleFromToken;

    const targetId = routeId ? Number(routeId) : this.currentId;

    this.usersService.getUserById(targetId).subscribe({
      next: (data) => {
        console.log('Данные пользователя:', data);
        this.user = data;
      },
      error: (err) => console.error('Ошибка загрузки профиля', err),
      complete: () => console.log('Запрос завершен'),
    });

  }

  deleteUser(id: number) {
    if (!confirm("Уверены?")) return;


    this.usersService.deleteUser(id).subscribe({
      next: () => {
        console.log("Пользователь удалён");
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Ошибка удаления', err);
        alert('Не удалось удалить пользователя');
      }
    });

  }
}
