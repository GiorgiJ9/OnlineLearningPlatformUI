import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private auth: AuthService) {}
  get isLoggedIn() { return this.auth.isLoggedIn; }
  get dashRoute() {
    const r = this.auth.role;
    if (r === 'Admin') return '/dashboard/admin';
    if (r === 'Teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  }
}