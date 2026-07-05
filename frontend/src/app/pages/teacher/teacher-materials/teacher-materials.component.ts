import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/teacher/dashboard', icon: '📊' },
  { label: 'My Classes', route: '/teacher/classes', icon: '🏫' },
  { label: 'Attendance', route: '/teacher/attendance', icon: '📋' },
  { label: 'Assignments', route: '/teacher/assignments', icon: '📝' },
  { label: 'Results', route: '/teacher/results', icon: '📈' },
  { label: 'Materials', route: '/teacher/materials', icon: '📚' },
];

@Component({
  selector: 'app-teacher-materials',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Learning Materials</h1></div>
      <div class="card">
        <div class="card-header"><h3>Uploaded Materials</h3></div>
        <div *ngIf="materials.length">
          <div class="material-item" *ngFor="let m of materials">
            <span class="file-icon">📄</span>
            <div>
              <strong>{{ m.title }}</strong>
              <p>{{ m.description }}</p>
              <span class="badge badge-info">{{ m.fileType }}</span>
            </div>
            <a [href]="apiBase + m.fileUrl" target="_blank" class="btn btn-outline btn-sm">Download</a>
          </div>
        </div>
        <div class="empty-state" *ngIf="!materials.length"><p>No materials uploaded yet</p></div>
      </div>
    </app-layout>
  `,
  styles: [`
    .material-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-bottom: 1px solid #eee;
      .file-icon { font-size: 32px; }
      div { flex: 1; }
      p { color: #666; font-size: 13px; margin: 4px 0; }
    }
  `],
})
export class TeacherMaterialsComponent implements OnInit {
  navItems = TEACHER_NAV;
  materials: any[] = [];
  apiBase = environment.apiUrl.replace('/api', '');

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/materials').subscribe(d => this.materials = d); }
}
