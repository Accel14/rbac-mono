import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API } from '../constants';
import { Observable } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private readonly apiUrl = `${BACKEND_API}/api/users`;

    constructor(private http: HttpClient) { }

    getUserById(id: number) {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    deleteUser(id: number) {
        return this.http.delete<User>(`${this.apiUrl}/${id}`)
    }

}
