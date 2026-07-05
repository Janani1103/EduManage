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
  selector: 'app-teacher-results',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Exam Results</h1></div>
      <div class="card">
        <div class="card-header"><h3>Exams</h3><button class="btn btn-primary" (click)="showExamModal=true">+ Create Exam</button></div>
        <table *ngIf="exams.length">
          <thead><tr><th>Title</th><th>Class</th><th>Date</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let e of exams">
              <td>{{ e.title }}</td><td>{{ e.class?.name }}</td><td>{{ e.examDate | date }}</td>
              <td><span class="badge" [class.badge-success]="e.isPublished">{{ e.isPublished ? 'Yes' : 'No' }}</span></td>
              <td><button *ngIf="!e.isPublished" class="btn btn-primary btn-sm" (click)="publish(e._id)">Publish</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card" *ngIf="results.length">
        <div class="card-header"><h3>Results</h3></div>
        <table>
          <thead><tr><th>Exam</th><th>Student</th><th>Marks</th><th>Grade</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of results"><td>{{ r.exam?.title }}</td><td>{{ r.student?.user?.name }}</td><td>{{ r.marks }}</td><td>{{ r.grade }}</td></tr>
          </tbody>
        </table>
      </div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showExamModal" (click)="showExamModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Create Exam</h2>
        <div class="form-group"><label>Title</label><input [(ngModel)]="examForm.title"></div>
        <div class="form-group"><label>Class</label><select [(ngModel)]="examForm.class"><option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option></select></div>
        <div class="form-group"><label>Exam Date</label><input type="date" [(ngModel)]="examForm.examDate"></div>
        <div class="form-group"><label>Max Marks</label><input type="number" [(ngModel)]="examForm.maxMarks"></div>
        <button class="btn btn-primary" (click)="saveExam()">Save</button>
        <button class="btn btn-outline" (click)="showExamModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class TeacherResultsComponent implements OnInit {
  navItems = TEACHER_NAV;
  exams: any[] = [];
  results: any[] = [];
  classes: any[] = [];
  showExamModal = false;
  examForm: any = { maxMarks: 100 };

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/exams').subscribe(d => this.exams = d);
    this.api.get<any[]>('/results').subscribe(d => this.results = d);
    this.api.get<any[]>('/classes').subscribe(d => this.classes = d);
  }
  saveExam(): void { this.api.post('/exams', this.examForm).subscribe(() => { this.showExamModal = false; this.ngOnInit(); }); }
  publish(id: string): void { this.api.put(`/exams/${id}/publish`, {}).subscribe(() => this.ngOnInit()); }
}
