import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../../core/services/course.service';
import { User, Course } from '../../../shared/models/models';

@Component({ selector: 'app-admin-dashboard', templateUrl: './admin-dashboard.component.html', styleUrls: ['./admin-dashboard.component.scss'] })
export class AdminDashboardComponent implements OnInit {
  tab: 'pending' | 'users' | 'courses' = 'pending';
  pendingUsers: User[] = [];
  allUsers: User[] = [];
  allCourses: Course[] = [];
  loading = true;
  success = ''; error = '';

  roles = ['Student', 'Teacher', 'Admin'];

  constructor(private userSvc: UserService, private courseSvc: CourseService) {}

  get stats() {
    return {
      pending: this.pendingUsers.length,
      users: this.allUsers.length,
      courses: this.allCourses.length,
      published: this.allCourses.filter(c => c.status === 'Published').length
    };
  }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    this.userSvc.getPending().subscribe(d => { this.pendingUsers = d; this.loading = false; });
    this.userSvc.getAll().subscribe(d => this.allUsers = d);
    this.courseSvc.getAllForAdmin().subscribe(d => this.allCourses = d);
  }

  approve(user: User) {
    this.userSvc.approve(user.id).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
        this.allUsers = this.allUsers.map(u => u.id === user.id ? { ...u, isApproved: true } : u);
        this.notify('User approved successfully!');
      },
      error: () => this.notifyErr('Failed to approve user.')
    });
  }

  changeRole(user: User, role: string) {
    this.userSvc.updateRole(user.id, role).subscribe({
      next: updated => {
        this.allUsers = this.allUsers.map(u => u.id === updated.id ? updated : u);
        this.notify('Role updated!');
      },
      error: () => this.notifyErr('Failed to update role.')
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure?')) return;
    this.userSvc.delete(id).subscribe({
      next: () => { this.allUsers = this.allUsers.filter(u => u.id !== id); this.notify('User deleted.'); },
      error: () => this.notifyErr('Failed to delete.')
    });
  }

  toggleCourseStatus(course: Course) {
  const status = course.status === 'Published' ? 'Draft' : 'Published';
  this.courseSvc.update(course.id, { status }).subscribe({
    next: (updated) => {
      // 204 No Content - updated შეიძლება null იყოს
      this.allCourses = this.allCourses.map(c =>
        c.id === course.id ? { ...course, status } : c
      );
      this.notify('Course status updated!');
    },
    error: () => this.notifyErr('Failed to update.')
  });
}

  private notify(msg: string) { this.success = msg; setTimeout(() => this.success = '', 3000); }
  private notifyErr(msg: string) { this.error = msg; setTimeout(() => this.error = '', 3000); }
}
