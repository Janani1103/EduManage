import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
  { label: 'Teachers', route: '/admin/teachers', icon: '👨‍🏫' },
  { label: 'Students', route: '/admin/students', icon: '👨‍🎓' },
  { label: 'Subjects', route: '/admin/subjects', icon: '📖' },
  { label: 'Classes', route: '/admin/classes', icon: '🏫' },
  { label: 'Payments', route: '/admin/payments', icon: '💰' },
  { label: 'Reports', route: '/admin/reports', icon: '📈' },
];

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Reports</h1><p>Analytics and insights</p></div>
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card"><div class="stat-value">{{ stats.totalStudents }}</div><div class="stat-label">Students</div></div>
        <div class="stat-card"><div class="stat-value">{{ stats.totalTeachers }}</div><div class="stat-label">Teachers</div></div>
        <div class="stat-card"><div class="stat-value">Rs. {{ stats.monthlyIncome }}</div><div class="stat-label">Monthly Income</div></div>
        <div class="stat-card"><div class="stat-value">{{ stats.pendingFees }}</div><div class="stat-label">Pending Fees</div></div>
      </div>
      <div class="card" *ngIf="workload.length">
        <div class="card-header"><h3>Teacher Workload</h3></div>
        <div class="table-container">
          <table>
            <thead><tr><th>Teacher</th><th>Classes</th><th>Total Students</th></tr></thead>
            <tbody>
              <tr *ngFor="let w of workload">
                <td>{{ w.name }}</td><td>{{ w.classCount }}</td><td>{{ w.totalStudents }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-layout>
  `,
})
export class AdminReportsComponent implements OnInit {
  navItems = ADMIN_NAV;
  stats: any = null;
  workload: any[] = [];

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.get('/reports/dashboard').subscribe(d => this.stats = d);
    this.api.get<any[]>('/reports/teacher-workload').subscribe(d => this.workload = d);
  }
}
