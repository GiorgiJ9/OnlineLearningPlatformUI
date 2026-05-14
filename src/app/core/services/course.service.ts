import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourseRequest, UpdateCourseRequest, Lesson, CreateLessonRequest, UpdateLessonRequest, Assignment, CreateAssignmentRequest, Submission, Enrollment } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // Courses
  getAll(): Observable<Course[]> { return this.http.get<Course[]>(`${this.api}/courses`); }
  getAllForAdmin(): Observable<Course[]> { return this.http.get<Course[]>(`${this.api}/courses/all`); }
  getById(id: string): Observable<Course> { return this.http.get<Course>(`${this.api}/courses/${id}`); }
  create(req: CreateCourseRequest): Observable<Course> { return this.http.post<Course>(`${this.api}/courses`, req); }
  update(id: string, req: UpdateCourseRequest): Observable<Course> { return this.http.put<Course>(`${this.api}/courses/${id}`, req); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.api}/courses/${id}`); }
  enroll(id: string): Observable<void> { return this.http.post<void>(`${this.api}/courses/${id}/enroll`, {}); }


  // Lessons
  getLessons(courseId: string): Observable<Lesson[]> { return this.http.get<Lesson[]>(`${this.api}/courses/${courseId}/lessons`); }
  createLesson(courseId: string, req: CreateLessonRequest): Observable<Lesson> { return this.http.post<Lesson>(`${this.api}/courses/${courseId}/lessons`, req); }
  updateLesson(courseId: string, lessonId: string, req: UpdateLessonRequest): Observable<Lesson> { return this.http.put<Lesson>(`${this.api}/courses/${courseId}/lessons/${lessonId}`, req); }
  deleteLesson(courseId: string, lessonId: string): Observable<void> { return this.http.delete<void>(`${this.api}/courses/${courseId}/lessons/${lessonId}`); }

  // Assignments
  getAssignments(courseId: string): Observable<Assignment[]> { return this.http.get<Assignment[]>(`${this.api}/courses/${courseId}/assignments`); }
  createAssignment(courseId: string, req: CreateAssignmentRequest): Observable<Assignment> { return this.http.post<Assignment>(`${this.api}/courses/${courseId}/assignments`, req); }
  submit(assignmentId: string, content: string): Observable<Submission> { return this.http.post<Submission>(`${this.api}/assignments/${assignmentId}/submit`, { content }); }
  getSubmissions(assignmentId: string): Observable<Submission[]> { return this.http.get<Submission[]>(`${this.api}/assignments/${assignmentId}/submissions`); }
  grade(submissionId: string, score: number, feedback: string): Observable<Submission> { return this.http.put<Submission>(`${this.api}/assignments/${submissionId}/grade`, { score, feedback }); }

  // Enrollments
  getMySubmission(assignmentId: string): Observable<Submission> {
    return this.http.get<Submission>(`${this.api}/assignments/${assignmentId}/my-submission`);
  }
  getMyEnrollments(): Observable<Enrollment[]> { return this.http.get<Enrollment[]>(`${this.api}/enrollments/my`); }
}
