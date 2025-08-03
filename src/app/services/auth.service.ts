import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_API } from '../constants';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${BACKEND_API}/api/auth`;

    constructor(private http: HttpClient) { }

    register(user: CreateUserDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    login(email: string, password: string) {
        return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password });
    }

    logout(): void {
        localStorage.removeItem('access_token');
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getFromToken(attribute: string): number | null {
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload[attribute] ?? null;
        } catch (error) {
            console.error('Ошибка при парсинге токена:', error);
            return null;
        }
    }
}
