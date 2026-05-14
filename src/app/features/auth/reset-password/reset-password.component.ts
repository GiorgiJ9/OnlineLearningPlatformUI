import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = false;
  success = '';
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email:       ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}).*$/)]]
    });
  }

  submit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  this.loading = true;
  this.auth.resetPassword(this.form.value).subscribe({
    next: () => {
      this.success = 'Reset request submitted! Please wait for admin approval.';
      this.loading = false;
    },
    error: err => { this.error = err.error?.message || 'Failed.'; this.loading = false; }
  });
}
}