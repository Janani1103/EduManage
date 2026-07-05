import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/public/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/public/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./pages/public/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/public/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },

  // Admin routes
  { path: 'admin/dashboard', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/teachers', loadComponent: () => import('./pages/admin/admin-teachers/admin-teachers.component').then(m => m.AdminTeachersComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/students', loadComponent: () => import('./pages/admin/admin-students/admin-students.component').then(m => m.AdminStudentsComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/subjects', loadComponent: () => import('./pages/admin/admin-subjects/admin-subjects.component').then(m => m.AdminSubjectsComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/classes', loadComponent: () => import('./pages/admin/admin-classes/admin-classes.component').then(m => m.AdminClassesComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/payments', loadComponent: () => import('./pages/admin/admin-payments/admin-payments.component').then(m => m.AdminPaymentsComponent), canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'admin/reports', loadComponent: () => import('./pages/admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent), canActivate: [authGuard, roleGuard(['admin'])] },

  // Teacher routes
  { path: 'teacher/dashboard', loadComponent: () => import('./pages/teacher/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent), canActivate: [authGuard, roleGuard(['teacher'])] },
  { path: 'teacher/classes', loadComponent: () => import('./pages/teacher/teacher-classes/teacher-classes.component').then(m => m.TeacherClassesComponent), canActivate: [authGuard, roleGuard(['teacher'])] },
  { path: 'teacher/attendance', loadComponent: () => import('./pages/teacher/teacher-attendance/teacher-attendance.component').then(m => m.TeacherAttendanceComponent), canActivate: [authGuard, roleGuard(['teacher'])] },
  { path: 'teacher/assignments', loadComponent: () => import('./pages/teacher/teacher-assignments/teacher-assignments.component').then(m => m.TeacherAssignmentsComponent), canActivate: [authGuard, roleGuard(['teacher'])] },
  { path: 'teacher/results', loadComponent: () => import('./pages/teacher/teacher-results/teacher-results.component').then(m => m.TeacherResultsComponent), canActivate: [authGuard, roleGuard(['teacher'])] },
  { path: 'teacher/materials', loadComponent: () => import('./pages/teacher/teacher-materials/teacher-materials.component').then(m => m.TeacherMaterialsComponent), canActivate: [authGuard, roleGuard(['teacher'])] },

  // Student routes
  { path: 'student/dashboard', loadComponent: () => import('./pages/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/timetable', loadComponent: () => import('./pages/student/student-timetable/student-timetable.component').then(m => m.StudentTimetableComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/assignments', loadComponent: () => import('./pages/student/student-assignments/student-assignments.component').then(m => m.StudentAssignmentsComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/materials', loadComponent: () => import('./pages/student/student-materials/student-materials.component').then(m => m.StudentMaterialsComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/attendance', loadComponent: () => import('./pages/student/student-attendance/student-attendance.component').then(m => m.StudentAttendanceComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/results', loadComponent: () => import('./pages/student/student-results/student-results.component').then(m => m.StudentResultsComponent), canActivate: [authGuard, roleGuard(['student'])] },
  { path: 'student/payments', loadComponent: () => import('./pages/student/student-payments/student-payments.component').then(m => m.StudentPaymentsComponent), canActivate: [authGuard, roleGuard(['student'])] },

  { path: '**', redirectTo: '' },
];
