import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PendingComponent } from './features/auth/pending/pending.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { StudentDashboardComponent } from './features/dashboard/student/student-dashboard.component';
import { TeacherDashboardComponent } from './features/dashboard/teacher/teacher-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin/admin-dashboard.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';

@NgModule({
  declarations: [
    AppComponent, NavbarComponent,
    LoginComponent, RegisterComponent, PendingComponent,
    CourseDetailComponent, CourseListComponent,
    StudentDashboardComponent, TeacherDashboardComponent, AdminDashboardComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
