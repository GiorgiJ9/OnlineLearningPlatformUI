import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.scss'] })
export class RegisterComponent {
  form: FormGroup;
  loading = false; error = ''; showPw = false;

  roles = [
    { value: 'Student', label: 'Student', icon: '👨‍🎓', desc: 'Learn from courses' },
    { value: 'Teacher', label: 'Teacher', icon: '👩‍🏫', desc: 'Create & teach courses' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,}).*$/)]],
      role:      ['Student']
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: res => {
        if (!res.user.isApproved) { this.router.navigate(['/auth/pending']); return; }
        const r = res.user.role;
        if (r === 'Teacher') this.router.navigate(['/dashboard/teacher']);
        else this.router.navigate(['/dashboard/student']);
      },
      error: err => { this.error = err.error?.message || 'Registration failed.'; this.loading = false; }
    });
  }
}
