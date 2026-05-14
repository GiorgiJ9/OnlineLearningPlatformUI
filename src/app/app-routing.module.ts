import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PendingComponent } from './features/auth/pending/pending.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { StudentDashboardComponent } from './features/dashboard/student/student-dashboard.component';
import { TeacherDashboardComponent } from './features/dashboard/teacher/teacher-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin/admin-dashboard.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth/login',    component: LoginComponent,    canActivate: [GuestGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'auth/reset-password', component: ResetPasswordComponent },
  { path: 'auth/pending',  component: PendingComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'dashboard/student', component: StudentDashboardComponent, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  { path: 'dashboard/teacher', component: TeacherDashboardComponent, canActivate: [AuthGuard], data: { roles: ['Teacher'] } },
  { path: 'dashboard/admin',   component: AdminDashboardComponent,   canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'dashboard', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
