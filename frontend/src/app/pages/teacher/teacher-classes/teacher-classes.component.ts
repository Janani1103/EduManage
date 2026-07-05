import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>My Classes</h1></div>
      <div class="card" *ngFor="let c of myClasses">
        <h3 style="color:#B22222">{{ c.name }} - {{ c.subject?.name }}</h3>
        <p>Students: {{ c.students?.length || 0 }} | Fee: Rs. {{ c.fee }}</p>
        <div *ngIf="c.schedule?.length"><strong>Schedule:</strong>
          <span *ngFor="let s of c.schedule" class="badge badge-info" style="margin:4px">{{ s.day }} {{ s.startTime }}-{{ s.endTime }} ({{ s.room }})</span>
        </div>
      </div>
      <div class="empty-state" *ngIf="!myClasses.length"><p>No classes assigned</p></div>
    </app-layout>
  `,
})
export class TeacherClassesComponent implements OnInit {
  navItems = TEACHER_NAV;
  myClasses: any[] = [];
  constructor(private auth: AuthService, private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/classes').subscribe(classes => {
      this.myClasses = classes.filter(c => c.teacher?.user?.email === this.auth.currentUser?.email);
    });
  }
}
