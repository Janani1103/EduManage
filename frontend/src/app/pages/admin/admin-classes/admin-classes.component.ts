import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-admin-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Classes</h1><p>Manage classes and schedules</p></div>
      <div class="card">
        <div class="card-header"><h3>All Classes</h3><button class="btn btn-primary" (click)="openModal()">+ Create Class</button></div>
        <div class="table-container" *ngIf="classes.length">
          <table>
            <thead><tr><th>Name</th><th>Subject</th><th>Teacher</th><th>Students</th><th>Fee</th><th>Status</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of classes">
                <td>{{ c.name }}</td>
                <td>{{ c.subject?.name }}</td>
                <td>{{ c.teacher?.user?.name || 'Unassigned' }}</td>
                <td>{{ c.students?.length || 0 }}</td>
                <td>Rs. {{ c.fee }}</td>
                <td><span class="badge" [class.badge-success]="c.isActive">{{ c.isActive ? 'Active' : 'Inactive' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Create Class</h2>
        <div class="form-group"><label>Class Name</label><input [(ngModel)]="form.name"></div>
        <div class="form-group"><label>Subject</label>
          <select [(ngModel)]="form.subject"><option *ngFor="let s of subjects" [value]="s._id">{{ s.name }}</option></select>
        </div>
        <div class="form-group"><label>Teacher</label>
          <select [(ngModel)]="form.teacher"><option value="">Unassigned</option><option *ngFor="let t of teachers" [value]="t._id">{{ t.user?.name }}</option></select>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Fee</label><input type="number" [(ngModel)]="form.fee"></div>
          <div class="form-group"><label>Capacity</label><input type="number" [(ngModel)]="form.capacity"></div>
        </div>
        <div class="form-group"><label>Academic Year</label><input [(ngModel)]="form.academicYear" placeholder="2024/2025"></div>
        <button class="btn btn-primary" (click)="save()">Save</button>
        <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class AdminClassesComponent implements OnInit {
  navItems = ADMIN_NAV;
  classes: any[] = [];
  subjects: any[] = [];
  teachers: any[] = [];
  showModal = false;
  form: any = { fee: 0, capacity: 30 };

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.load();
    this.api.get<any[]>('/subjects').subscribe(d => this.subjects = d);
    this.api.get<any[]>('/teachers').subscribe(d => this.teachers = d);
  }
  load(): void { this.api.get<any[]>('/classes').subscribe(d => this.classes = d); }
  openModal(): void { this.form = { fee: 0, capacity: 30 }; this.showModal = true; }
  save(): void { this.api.post('/classes', this.form).subscribe(() => { this.showModal = false; this.load(); }); }
}
