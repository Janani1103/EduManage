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
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>My Attendance</h1></div>
      <div class="card">
        <table *ngIf="records.length">
          <thead><tr><th>Date</th><th>Class</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of records">
              <td>{{ r.date | date }}</td><td>{{ r.class?.name }}</td>
              <td><span class="badge" [ngClass]="{'badge-success': r.status==='present', 'badge-danger': r.status==='absent', 'badge-warning': r.status==='late'}">{{ r.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="!records.length"><p>No attendance records</p></div>
      </div>
    </app-layout>
  `,
})
export class StudentAttendanceComponent implements OnInit {
  navItems = STUDENT_NAV;
  records: any[] = [];
  constructor(private auth: AuthService, private api: ApiService) {}
  ngOnInit(): void {
    if (this.auth.currentUser?.profileId) {
      this.api.get<any[]>(`/attendance/student/${this.auth.currentUser.profileId}`).subscribe(d => this.records = d);
    }
  }
}
