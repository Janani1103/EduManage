import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/teacher/dashboard', icon: '📊' },
  { label: 'My Classes', route: '/teacher/classes', icon: '🏫' },
  { label: 'Attendance', route: '/teacher/attendance', icon: '📋' },
  { label: 'Assignments', route: '/teacher/assignments', icon: '📝' },
  { label: 'Results', route: '/teacher/results', icon: '📈' },
  { label: 'Materials', route: '/teacher/materials', icon: '📚' },
];

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Teacher Dashboard</h1><p>Welcome, {{ auth.currentUser?.name }}</p></div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">{{ myClasses.length }}</div><div class="stat-label">My Classes</div></div>
        <div class="stat-card"><div class="stat-value">{{ totalStudents }}</div><div class="stat-label">Total Students</div></div>
        <div class="stat-card"><div class="stat-value">{{ assignments.length }}</div><div class="stat-label">Assignments</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>My Classes</h3></div>
        <div class="table-container" *ngIf="myClasses.length">
          <table>
            <thead><tr><th>Class</th><th>Subject</th><th>Students</th><th>Schedule</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of myClasses">
                <td>{{ c.name }}</td><td>{{ c.subject?.name }}</td><td>{{ c.students?.length || 0 }}</td>
                <td><span *ngFor="let s of c.schedule">{{ s.day }} {{ s.startTime }}-{{ s.endTime }} </span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="!myClasses.length"><p>No classes assigned yet</p></div>
      </div>
    </app-layout>
  `,
})
export class TeacherDashboardComponent implements OnInit {
  navItems = TEACHER_NAV;
  myClasses: any[] = [];
  assignments: any[] = [];
  totalStudents = 0;

  constructor(public auth: AuthService, private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/classes').subscribe(classes => {
      this.myClasses = classes.filter(c => c.teacher?.user?.email === this.auth.currentUser?.email);
      this.totalStudents = this.myClasses.reduce((sum, c) => sum + (c.students?.length || 0), 0);
    });
    this.api.get<any[]>('/assignments').subscribe(a => this.assignments = a);
  }
}
