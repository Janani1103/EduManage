import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

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
  selector: 'app-student-materials',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Study Materials</h1></div>
      <div class="card" *ngFor="let m of materials">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>{{ m.title }}</strong><p style="color:#666;margin:4px 0">{{ m.description }}</p><span class="badge badge-info">{{ m.fileType }}</span></div>
          <a [href]="apiBase + m.fileUrl" target="_blank" class="btn btn-primary btn-sm">Download</a>
        </div>
      </div>
      <div class="empty-state" *ngIf="!materials.length"><p>No materials available</p></div>
    </app-layout>
  `,
})
export class StudentMaterialsComponent implements OnInit {
  navItems = STUDENT_NAV;
  materials: any[] = [];
  apiBase = environment.apiUrl.replace('/api', '');
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/materials').subscribe(d => this.materials = d); }
}
