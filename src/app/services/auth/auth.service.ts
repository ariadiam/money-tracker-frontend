import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/shared/interfaces/user';    
import { LoginRequest, LoginResponse, RegisterRequest } from '../../shared/interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
  return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
    .pipe(
      tap(response => {
        if (response?.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user._id);
          localStorage.setItem('username', response.data.user.username);
        } else {
          console.warn('Login response has no token', response);
        }
      })
    );
}

  register(payload: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: any[];
  }) {
    return this.http.post<any>('http://localhost:3000/api/auth/register', payload);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  saveAuthData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token does not have 3 parts');

    const payload = JSON.parse(atob(parts[1]));
    return payload.userId || null;
  } catch (e) {
    console.error('Invalid token format', e);
    return null;
  }
}

}
