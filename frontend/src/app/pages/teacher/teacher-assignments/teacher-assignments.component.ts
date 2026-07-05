import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', route: '/teacher/dashboard', icon: '📊' },
  { label: 'My Classes', route: '/teacher/classes', icon: '🏫' },
  { label: 'Attendance', route: '/teacher/attendance', icon: '📋' },
  { label: 'Assignments', route: '/teacher/assignments', icon: '📝' },
  { label: 'Results', route: '/teacher/results', icon: '📈' },
  { label: 'Materials', route: '/teacher/materials', icon: '📚' },
];

@Component({
  selector: 'app-teacher-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Assignments</h1></div>
      <div class="card">
        <div class="card-header"><h3>All Assignments</h3><button class="btn btn-primary" (click)="showModal=true">+ Create</button></div>
        <table *ngIf="assignments.length">
          <thead><tr><th>Title</th><th>Class</th><th>Due Date</th><th>Max Marks</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of assignments"><td>{{ a.title }}</td><td>{{ a.class?.name }}</td><td>{{ a.dueDate | date }}</td><td>{{ a.maxMarks }}</td></tr>
          </tbody>
        </table>
      </div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Create Assignment</h2>
        <div class="form-group"><label>Title</label><input [(ngModel)]="form.title"></div>
        <div class="form-group"><label>Class</label><select [(ngModel)]="form.class"><option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option></select></div>
        <div class="form-group"><label>Description</label><textarea [(ngModel)]="form.description"></textarea></div>
        <div class="form-group"><label>Due Date</label><input type="date" [(ngModel)]="form.dueDate"></div>
        <div class="form-group"><label>Max Marks</label><input type="number" [(ngModel)]="form.maxMarks"></div>
        <button class="btn btn-primary" (click)="save()">Save</button>
        <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class TeacherAssignmentsComponent implements OnInit {
  navItems = TEACHER_NAV;
  assignments: any[] = [];
  classes: any[] = [];
  showModal = false;
  form: any = { maxMarks: 100 };

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/assignments').subscribe(d => this.assignments = d);
    this.api.get<any[]>('/classes').subscribe(d => this.classes = d);
  }
  save(): void { this.api.post('/assignments', this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); }); }
}
