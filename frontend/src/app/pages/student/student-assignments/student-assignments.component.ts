import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Assignments</h1></div>
      <div class="card" *ngFor="let a of assignments">
        <h3>{{ a.title }}</h3>
        <p>{{ a.description }}</p>
        <p>Class: {{ a.class?.name }} | Due: {{ a.dueDate | date }} | Max Marks: {{ a.maxMarks }}</p>
        <button class="btn btn-primary btn-sm" (click)="selected=a; showModal=true">Submit</button>
      </div>
      <div class="empty-state" *ngIf="!assignments.length"><p>No assignments</p></div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Submit: {{ selected?.title }}</h2>
        <div class="form-group"><label>Your Answer</label><textarea [(ngModel)]="content"></textarea></div>
        <button class="btn btn-primary" (click)="submit()">Submit</button>
        <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class StudentAssignmentsComponent implements OnInit {
  navItems = STUDENT_NAV;
  assignments: any[] = [];
  showModal = false;
  selected: any = null;
  content = '';

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.get<any[]>('/assignments').subscribe(d => this.assignments = d); }
  submit(): void {
    this.api.post('/submissions', { assignment: this.selected._id, content: this.content }).subscribe(() => {
      this.showModal = false;
      alert('Submitted successfully!');
    });
  }
}
