import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Enrollment, Lesson, Assignment, Submission } from '../../../shared/models/models';

@Component({ selector: 'app-student-dashboard', templateUrl: './student-dashboard.component.html', styleUrls: ['./student-dashboard.component.scss'] })
export class StudentDashboardComponent implements OnInit {
  tab: 'courses' | 'lessons' | 'assignments' = 'courses';
  enrollments: Enrollment[] = [];
  lessons: Lesson[] = [];
  assignments: Assignment[] = [];
  selectedEnrollment: Enrollment | null = null;
  selectedAssignment: Assignment | null = null;
  mySubmissions: { [key: string]: Submission } = {};
  loading = false;
  success = ''; error = '';
  showSubmitModal = false;
  submitForm: FormGroup;

  constructor(private cs: CourseService, private auth: AuthService, private fb: FormBuilder) {
    this.submitForm = this.fb.group({ content: ['', Validators.required] });
  }

  get currentUser() { return this.auth.currentUser; }
  get completedCount(): number {
    return Object.values(this.mySubmissions).filter(s => s.status === 'Graded').length;
  }

  get inProgressCount(): number {
    return Object.values(this.mySubmissions).filter(s => s.status === 'Submitted' || s.status === 'Late').length;
  }

  ngOnInit() { this.loadEnrollments(); }

  loadEnrollments() {
    this.loading = true;
    this.cs.getMyEnrollments().subscribe({
      next: d => { this.enrollments = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  selectCourse(e: Enrollment) {
    this.selectedEnrollment = e;
    this.mySubmissions = {};
    this.cs.getLessons(e.courseId).subscribe(d => this.lessons = d);
    this.cs.getAssignments(e.courseId).subscribe(d => {
      this.assignments = d;
      d.forEach(a => {
        this.cs.getMySubmission(a.id).subscribe({
          next: s => { this.mySubmissions = { ...this.mySubmissions, [a.id]: s }; },
          error: () => { }
        });
      });
    });
    this.tab = 'lessons';
  }

  openSubmit(a: Assignment) {
    this.selectedAssignment = a;
    this.submitForm.reset();
    this.showSubmitModal = true;
  }

  submitAssignment() {
    if (!this.selectedAssignment || this.submitForm.invalid) return;
    this.cs.submit(this.selectedAssignment.id, this.submitForm.value.content).subscribe({
      next: s => {
        this.mySubmissions = { ...this.mySubmissions, [this.selectedAssignment!.id]: s };
        this.showSubmitModal = false;
        this.notify('Assignment submitted!');
      },
      error: err => this.notifyErr(err.error?.message || 'Failed to submit.')
    });
  }

  private notify(msg: string) { this.success = msg; setTimeout(() => this.success = '', 3000); }
  private notifyErr(msg: string) { this.error = msg; setTimeout(() => this.error = '', 3000); }
}