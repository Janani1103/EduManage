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
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Examination Results</h1></div>
      <div class="card">
        <table *ngIf="results.length">
          <thead><tr><th>Exam</th><th>Date</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of results">
              <td>{{ r.exam?.title }}</td><td>{{ r.exam?.examDate | date }}</td>
              <td>{{ r.marks }} / {{ r.exam?.maxMarks }}</td><td><span class="badge badge-info">{{ r.grade }}</span></td><td>{{ r.remarks || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="!results.length"><p>No published results yet</p></div>
      </div>
    </app-layout>
  `,
})
export class StudentResultsComponent implements OnInit {
  navItems = STUDENT_NAV;
  results: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/results').subscribe(d => this.results = d); }
}
