import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> { return this.http.get<User[]>(this.api); }
  getPending(): Observable<User[]> { return this.http.get<User[]>(`${this.api}/pending`); }
  getById(id: string): Observable<User> { return this.http.get<User>(`${this.api}/${id}`); }
  approve(id: string): Observable<User> { return this.http.put<User>(`${this.api}/${id}/approve`, {}); }
  updateRole(id: string, role: string): Observable<User> { return this.http.put<User>(`${this.api}/${id}/role`, { role }); }
  update(id: string, data: any): Observable<User> { return this.http.put<User>(`${this.api}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
