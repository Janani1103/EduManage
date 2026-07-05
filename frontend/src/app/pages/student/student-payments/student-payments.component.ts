import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';

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
  selector: 'app-student-payments',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Payments</h1></div>
      <div class="card">
        <table *ngIf="payments.length">
          <thead><tr><th>Class</th><th>Amount</th><th>Month</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of payments">
              <td>{{ p.class?.name || '-' }}</td><td>Rs. {{ p.amount }}</td><td>{{ p.month || '-' }}</td>
              <td>{{ p.dueDate | date }}</td>
              <td><span class="badge" [ngClass]="{'badge-success': p.status==='paid', 'badge-warning': p.status==='pending', 'badge-danger': p.status==='overdue'}">{{ p.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="!payments.length"><p>No payment records</p></div>
      </div>
    </app-layout>
  `,
})
export class StudentPaymentsComponent implements OnInit {
  navItems = STUDENT_NAV;
  payments: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/payments').subscribe(d => this.payments = d); }
}
