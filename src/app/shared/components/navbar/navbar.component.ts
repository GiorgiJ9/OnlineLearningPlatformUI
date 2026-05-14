import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  scrolled = false;
  menuOpen = false;
  dropOpen = false;

  constructor(private auth: AuthService) {}
  ngOnInit() { this.auth.currentUser$.subscribe(u => this.user = u); }

  get loggedIn() { return this.auth.isLoggedIn; }
  get initials() { return this.user ? `${this.user.firstName[0]}${this.user.lastName[0]}` : ''; }
  get dashRoute() {
    if (!this.user) return '/dashboard';
    if (this.user.role === 'Admin') return '/dashboard/admin';
    if (this.user.role === 'Teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  }

  @HostListener('window:scroll') onScroll() { this.scrolled = window.scrollY > 20; }
  @HostListener('document:click', ['$event']) onClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.user-menu')) this.dropOpen = false;
  }

  logout() { this.auth.logout(); }
}
