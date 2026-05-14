import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Lesson, Assignment, Submission } from '../../../shared/models/models';

@Component({ selector: 'app-teacher-dashboard', templateUrl: './teacher-dashboard.component.html', styleUrls: ['./teacher-dashboard.component.scss'] })
export class TeacherDashboardComponent implements OnInit {
  tab: 'courses' | 'lessons' | 'assignments' | 'submissions' = 'courses';
  courses: Course[] = [];
  lessons: Lesson[] = [];
  assignments: Assignment[] = [];
  submissions: Submission[] = [];
  selectedCourse: Course | null = null;
  selectedAssignment: Assignment | null = null;
  loading = false;
  success = ''; error = '';

  showCourseModal = false;
  showLessonModal = false;
  showAssignModal = false;
  showGradeModal = false;
  gradeSubmission: Submission | null = null;

  courseForm: FormGroup;
  lessonForm: FormGroup;
  assignForm: FormGroup;
  gradeForm: FormGroup;

  constructor(private cs: CourseService, private auth: AuthService, private fb: FormBuilder) {
    this.courseForm = this.fb.group({ title: ['', Validators.required], description: ['', Validators.required], category: ['', Validators.required], duration: [1, [Validators.required, Validators.min(1)]], price: [0, [Validators.required, Validators.min(0)]] });
    this.lessonForm = this.fb.group({ title: ['', Validators.required], content: ['', Validators.required], attachmentUrl: [''], orderIndex: [0] });
    this.assignForm = this.fb.group({ title: ['', Validators.required], description: ['', Validators.required], dueDate: ['', Validators.required], maxScore: [100, [Validators.required, Validators.min(1)]] });
    this.gradeForm = this.fb.group({ score: [0, [Validators.required, Validators.min(0)]], feedback: [''] });
  }

  get currentUser() { return this.auth.currentUser; }
  get totalStudents() { return this.courses.reduce((s, c) => s + c.enrolledStudents, 0); }

  ngOnInit() { this.loadCourses(); }

  loadCourses() {
    this.loading = true;
    this.cs.getAll().subscribe({ next: d => { this.courses = d; this.loading = false; }, error: () => this.loading = false });
  }

  selectCourse(c: Course) {
    this.selectedCourse = c;
    this.cs.getLessons(c.id).subscribe(d => this.lessons = d);
    this.cs.getAssignments(c.id).subscribe(d => this.assignments = d);
    this.tab = 'lessons';
  }

  selectAssignment(a: Assignment) {
    this.selectedAssignment = a;
    this.cs.getSubmissions(a.id).subscribe(d => { this.submissions = d; this.tab = 'submissions'; });
  }

  createCourse() {
    if (this.courseForm.invalid) return;
    this.cs.create(this.courseForm.value).subscribe({
      next: () => { this.showCourseModal = false; this.courseForm.reset({ duration: 1, price: 0 }); this.loadCourses(); this.notify('Course created!'); },
      error: err => this.notifyErr(err.error?.message || 'Failed.')
    });
  }

  deleteCourse(id: string) {
    if (!confirm('Delete this course?')) return;
    this.cs.delete(id).subscribe({ next: () => { this.courses = this.courses.filter(c => c.id !== id); this.notify('Deleted!'); }, error: () => this.notifyErr('Failed.') });
  }

  createLesson() {
    if (!this.selectedCourse || this.lessonForm.invalid) return;
    this.cs.createLesson(this.selectedCourse.id, this.lessonForm.value).subscribe({
      next: l => { this.lessons = [...this.lessons, l]; this.showLessonModal = false; this.lessonForm.reset({ orderIndex: 0 }); this.notify('Lesson added!'); },
      error: err => this.notifyErr(err.error?.message || 'Failed.')
    });
  }

  deleteLesson(lessonId: string) {
    if (!this.selectedCourse || !confirm('Delete lesson?')) return;
    this.cs.deleteLesson(this.selectedCourse.id, lessonId).subscribe({
      next: () => { this.lessons = this.lessons.filter(l => l.id !== lessonId); this.notify('Deleted!'); },
      error: () => this.notifyErr('Failed.')
    });
  }

  createAssignment() {
    if (!this.selectedCourse || this.assignForm.invalid) return;
    this.cs.createAssignment(this.selectedCourse.id, this.assignForm.value).subscribe({
      next: a => { this.assignments = [...this.assignments, a]; this.showAssignModal = false; this.assignForm.reset({ maxScore: 100 }); this.notify('Assignment created!'); },
      error: err => this.notifyErr(err.error?.message || 'Failed.')
    });
  }

  openGrade(s: Submission) { this.gradeSubmission = s; this.gradeForm.patchValue({ score: s.score || 0, feedback: s.feedback || '' }); this.showGradeModal = true; }

  submitGrade() {
    if (!this.gradeSubmission || this.gradeForm.invalid) return;
    const { score, feedback } = this.gradeForm.value;
    this.cs.grade(this.gradeSubmission.id, score, feedback).subscribe({
      next: updated => { this.submissions = this.submissions.map(s => s.id === updated.id ? updated : s); this.showGradeModal = false; this.notify('Graded!'); },
      error: () => this.notifyErr('Failed.')
    });
  }

  statusBadge(s: string) { return { 'Submitted': 'badge-info', 'Graded': 'badge-success', 'Late': 'badge-danger', 'Pending': 'badge-gray' }[s] || 'badge-gray'; }

  private notify(msg: string) { this.success = msg; setTimeout(() => this.success = '', 3000); }
  private notifyErr(msg: string) { this.error = msg; setTimeout(() => this.error = '', 3000); }

    get publishedCount(): number {
    return this.courses.filter(c => c.status === 'Published').length;
  }
}
