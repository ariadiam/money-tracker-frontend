import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
    return this.http.post<any>('http://localhost:3000/api/auth/register', payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
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

  getUsername(): string | null {
    const stored = localStorage.getItem('username');
    if (stored) return stored;

    return this.getUsernameFromToken();
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const [, payloadB64] = token.split('.');
      if (!payloadB64) return null;
      const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(b64);
      const payload = JSON.parse(json);
      return payload?.username ?? null;
    } catch (e) {
      console.error('Failed to parse token', e);
      return null;
    }
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
