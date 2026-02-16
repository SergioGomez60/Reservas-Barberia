import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.apiUrl;
  private TOKEN_KEY = 'token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = this.getToken();
    if (token) {
      this.getProfile().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/auth/register`, { name, email, password })
      .pipe(
        tap((response: AuthResponse) => {
          if (response && response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          }
          if (response && response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        map((response: AuthResponse) => response.user as User)
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/auth/login`, { email, password })
      .pipe(
        tap((response: AuthResponse) => {
          if (response && response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          }
          if (response && response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        map((response: AuthResponse) => response.user as User)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/api/user/profile`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
