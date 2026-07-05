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
  selector: 'app-student-timetable',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Timetable</h1></div>
      <div class="card" *ngFor="let c of classes">
        <h3 style="color:#B22222">{{ c.name }}</h3>
        <p>Teacher: {{ c.teacher?.user?.name || 'TBA' }} | Subject: {{ c.subject?.name }}</p>
        <table *ngIf="c.schedule?.length">
          <thead><tr><th>Day</th><th>Time</th><th>Room</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of c.schedule"><td>{{ s.day }}</td><td>{{ s.startTime }} - {{ s.endTime }}</td><td>{{ s.room }}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="empty-state" *ngIf="!classes.length"><p>No classes enrolled</p></div>
    </app-layout>
  `,
})
export class StudentTimetableComponent implements OnInit {
  navItems = STUDENT_NAV;
  classes: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/classes').subscribe(d => this.classes = d); }
}
