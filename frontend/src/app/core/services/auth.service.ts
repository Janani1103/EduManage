import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  profileId?: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const data = localStorage.getItem('edumanage_user');
    return data ? JSON.parse(data) : null;
  }

  get token(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, { email, password }).pipe(
      tap((user: User) => this.setUser(user))
    );
  }

  register(data: { name: string; email: string; password: string; role?: string; phone?: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, data).pipe(
      tap((user: User) => this.setUser(user))
    );
  }

  logout(): void {
    localStorage.removeItem('edumanage_user');
    this.currentUserSubject.next(null);
  }

  private setUser(user: User): void {
    localStorage.setItem('edumanage_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getDashboardRoute(): string {
    const role = this.currentUser?.role;
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  }
}
