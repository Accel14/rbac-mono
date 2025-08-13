import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <h2>Профиль пользователя</h2>

  @if (user) {
    <form #editForm="ngForm" (ngSubmit)="updateUser()">
      <div>
        <label><strong>ID:</strong> {{ user.id }}</label>
      </div>

      <div>
        <label><strong>Email:</strong></label>
        <input type="email" name="email" [(ngModel)]="user.email" [readonly]="!canEdit" required />
      </div>

      <div>
        <label><strong>Имя:</strong></label>
        <input type="text" name="name" [(ngModel)]="user.name" [readonly]="!canEdit" required />
      </div>

  
      @if (canEditRole && user.role !== 'admin') {
      <div>
        <label>Роль:</label>
        <select name="role" [(ngModel)]="user.role">
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      }
      @else {
        <p><strong>Роль:</strong> {{ user.role }}</p>
        }
      

      @if (canEdit) {
        <button type="submit">Сохранить изменения</button>
      }

    </form>

    <hr />

    @if (currentRole === 'admin') {
      <a routerLink="/users">Список всех пользователей</a>
      @if (currentId !== user.id) {
        <button (click)="deleteUser(user.id)">Удалить пользователя</button>
      }
    }
  }

  @else {
    <p>Загрузка данных...</p>
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

  get canEdit(): boolean {
    return this.currentRole === 'admin' || this.currentRole === 'manager';
  }

  get canEditRole(): boolean {
    return this.currentRole === 'admin';
  }

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('id');
    const subFromToken = this.authService.getFromToken('sub');
    const roleFromToken = this.authService.getFromToken('role');

    if (!subFromToken) return;

    this.currentId = subFromToken;
    this.currentRole = roleFromToken;

    const targetId = routeId ? Number(routeId) : this.currentId;

    this.usersService.getUserById(targetId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Ошибка загрузки профиля', err),
      complete: () => console.log('Запрос завершен'),
    });

  }

  updateUser() {
    if (!this.user) return;

    const updatedData = {
      name: this.user.name,
      email: this.user.email,
      role: this.canEditRole ? this.user.role : undefined,
    };

    this.usersService.updateUser(this.user.id, updatedData).subscribe({
      next: (data) => {
        this.user = data;
        alert('Профиль обновлён');
      },
      error: (err) => console.error('Ошибка обновления', err)
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
