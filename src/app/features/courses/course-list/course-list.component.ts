import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../shared/models/models';

@Component({ selector: 'app-course-list', templateUrl: './course-list.component.html', styleUrls: ['./course-list.component.scss'] })
export class CourseListComponent implements OnInit {
  courses: Course[] = []; filtered: Course[] = [];
  loading = true; search = ''; category = '';
  categories: string[] = [];
  success = ''; error = '';

  constructor(private cs: CourseService, private auth: AuthService) {}
  get isStudent() { return this.auth.role === 'Student'; }
  get isLoggedIn() { return this.auth.isLoggedIn; }

  ngOnInit() {
    this.cs.getAll().subscribe({
      next: d => { this.courses = d; this.filtered = d; this.categories = [...new Set(d.map(c => c.category))]; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filter() {
    this.filtered = this.courses.filter(c =>
      (!this.search || c.title.toLowerCase().includes(this.search.toLowerCase()) || c.description.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.category || c.category === this.category)
    );
  }

  enroll(id: string) {
    if (!this.isLoggedIn) { this.error = 'Please log in to enroll.'; return; }
    this.cs.enroll(id).subscribe({
      next: () => { this.success = 'Successfully enrolled!'; setTimeout(() => this.success = '', 3000); },
      error: err => { this.error = err.error?.message || 'Enrollment failed.'; setTimeout(() => this.error = '', 3000); }
    });
  }
}
