export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; firstName: string; lastName: string; role: string; }
export interface AuthResponse { token: string; user: User; }
export interface ResetPasswordRequest { email: string; newPassword: string; }

export interface User {
  id: string; email: string; firstName: string; lastName: string;
  role: 'Admin' | 'Teacher' | 'Student'; avatar: string | null;
  isApproved: boolean; createdAt: string;
}

export interface Course {
  id: string; title: string; description: string; teacherId: string;
  teacherFullName: string; category: string; duration: number; price: number;
  status: 'Draft' | 'Published' | 'Archived'; enrolledStudents: number; createdAt: string;
}
export interface CreateCourseRequest { title: string; description: string; category: string; duration: number; price: number; }
export interface UpdateCourseRequest { title?: string; description?: string; category?: string; duration?: number; price?: number; status?: string; }

export interface Lesson { id: string; courseId: string; title: string; content: string; attachmentUrl: string | null; orderIndex: number; createdAt: string; }
export interface CreateLessonRequest { title: string; content: string; attachmentUrl?: string; orderIndex?: number; }
export interface UpdateLessonRequest { title?: string; content?: string; attachmentUrl?: string; orderIndex?: number; }

export interface Assignment { id: string; courseId: string; title: string; description: string; dueDate: string; maxScore: number; submissionsCount: number; createdAt: string; }
export interface CreateAssignmentRequest { title: string; description: string; dueDate: string; maxScore: number; }

export interface Submission {
  id: string; assignmentId: string; studentId: string; studentFullName: string;
  content: string; fileUrl: string | null; status: 'Pending' | 'Submitted' | 'Late' | 'Graded';
  score: number | null; feedback: string | null; submittedAt: string;
}

export interface Enrollment { id: string; courseId: string; courseTitle: string; progressPercentage: number; enrolledAt: string; }
