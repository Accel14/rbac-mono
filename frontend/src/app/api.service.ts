import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // URL бэкенда (NestJS)

  constructor(private http: HttpClient) { }

  getData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/hello`);
  }

  sendData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, data);
  }
}