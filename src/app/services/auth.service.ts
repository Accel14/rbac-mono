import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) { }

    register(user: CreateUserDto): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }
}
