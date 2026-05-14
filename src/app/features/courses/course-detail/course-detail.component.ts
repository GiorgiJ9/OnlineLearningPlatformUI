import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Lesson, Assignment } from '../../../shared/models/models';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  assignments: Assignment[] = [];
  loading = true;
  success = ''; error = '';

  constructor(private route: ActivatedRoute, private cs: CourseService, private auth: AuthService) {}

  get isStudent() { return this.auth.role === 'Student'; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cs.getById(id).subscribe({
      next: c => {
        this.course = c;
        this.cs.getLessons(id).subscribe(l => this.lessons = l);
        this.cs.getAssignments(id).subscribe(a => this.assignments = a);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  enroll() {
    if (!this.course) return;
    this.cs.enroll(this.course.id).subscribe({
      next: () => { this.success = 'Successfully enrolled!'; setTimeout(() => this.success = '', 3000); },
      error: err => { this.error = err.error?.message || 'Failed.'; setTimeout(() => this.error = '', 3000); }
    });
  }
}