import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent {
  form: FormGroup;
  loading = false; error = ''; showPw = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: res => {
        const r = res.user.role;
        if (r === 'Admin') this.router.navigate(['/dashboard/admin']);
        else if (r === 'Teacher') this.router.navigate(['/dashboard/teacher']);
        else this.router.navigate(['/dashboard/student']);
      },
      error: err => { this.error = err.error?.message || 'Invalid credentials.'; this.loading = false; }
    });
  }
}
