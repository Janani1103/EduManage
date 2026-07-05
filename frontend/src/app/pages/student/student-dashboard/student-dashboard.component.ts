import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/student/dashboard', icon: '📊' },
  { label: 'Timetable', route: '/student/timetable', icon: '📅' },
  { label: 'Assignments', route: '/student/assignments', icon: '📝' },
  { label: 'Materials', route: '/student/materials', icon: '📚' },
  { label: 'Attendance', route: '/student/attendance', icon: '📋' },
  { label: 'Results', route: '/student/results', icon: '📈' },
  { label: 'Payments', route: '/student/payments', icon: '💰' },
];

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Student Dashboard</h1><p>Welcome, {{ auth.currentUser?.name }}</p></div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">{{ classes.length }}</div><div class="stat-label">Enrolled Classes</div></div>
        <div class="stat-card"><div class="stat-value">{{ assignments.length }}</div><div class="stat-label">Assignments</div></div>
        <div class="stat-card"><div class="stat-value">{{ pendingPayments }}</div><div class="stat-label">Pending Payments</div></div>
        <div class="stat-card"><div class="stat-value">{{ attendanceRate }}%</div><div class="stat-label">Attendance Rate</div></div>
      </div>
    </app-layout>
  `,
})
export class StudentDashboardComponent implements OnInit {
  navItems = STUDENT_NAV;
  classes: any[] = [];
  assignments: any[] = [];
  pendingPayments = 0;
  attendanceRate = 0;

  constructor(public auth: AuthService, private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/classes').subscribe(d => this.classes = d);
    this.api.get<any[]>('/assignments').subscribe(d => this.assignments = d);
    this.api.get<any[]>('/payments').subscribe(payments => {
      this.pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue').length;
    });
    if (this.auth.currentUser?.profileId) {
      this.api.get<any[]>(`/attendance/student/${this.auth.currentUser.profileId}`).subscribe(att => {
        if (att.length) {
          const present = att.filter(a => a.status === 'present' || a.status === 'late').length;
          this.attendanceRate = Math.round((present / att.length) * 100);
        }
      });
    }
  }
}
