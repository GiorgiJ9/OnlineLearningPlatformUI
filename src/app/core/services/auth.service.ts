import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private _currentUser = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null { return this._currentUser.value; }
  get isLoggedIn(): boolean { return !!this.getToken(); }
  get role(): string { return this.currentUser?.role || ''; }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, req).pipe(tap(r => this.setSession(r)));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, req).pipe(tap(r => this.setSession(r)));
  }

  resetPassword(req: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/request-reset`, req);
}

  logout(): void {
    sessionStorage.clear();
    this._currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { return sessionStorage.getItem('token'); }

  private setSession(res: AuthResponse): void {
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('user', JSON.stringify(res.user));
    this._currentUser.next(res.user);
  }

  private getStoredUser(): User | null {
    try { return JSON.parse(sessionStorage.getItem('user') || 'null'); } catch { return null; }
  }
}
