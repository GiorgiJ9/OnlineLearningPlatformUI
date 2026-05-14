import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pending',
  template: `
    <div class="pending-page">
      <div class="pending-card fade-in">
        <div class="icon">⏳</div>
        <h1>Account Pending Approval</h1>
        <p>Your account has been created successfully. An administrator will review and approve your account shortly.</p>
        <div class="alert alert-info">You will be able to log in once your account is approved.</div>
        <div class="actions">
          <button class="btn btn-outline" (click)="logout()">Back to Login</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pending-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background: linear-gradient(135deg,#6C63FF,#3A0CA3); }
    .pending-card { background:white; border-radius:var(--radius-lg); padding:48px; max-width:480px; width:100%; text-align:center; box-shadow:var(--shadow-lg); }
    .icon { font-size:64px; margin-bottom:20px; }
    h1 { font-size:24px; font-weight:800; color:var(--dark); margin-bottom:12px; }
    p  { color:var(--text-light); margin-bottom:20px; line-height:1.6; }
    .actions { margin-top:24px; }
  `]
})
export class PendingComponent {
  constructor(private auth: AuthService) {}
  logout() { this.auth.logout(); }
}
