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
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Mark Attendance</h1></div>
      <div class="card">
        <div class="form-row">
          <div class="form-group"><label>Class</label>
            <select [(ngModel)]="selectedClass" (change)="loadAttendance()">
              <option value="">Select class</option>
              <option *ngFor="let c of myClasses" [value]="c._id">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-group"><label>Date</label>
            <input type="date" [(ngModel)]="date" (change)="loadAttendance()">
          </div>
        </div>
        <div *ngIf="students.length">
          <table>
            <thead><tr><th>Student</th><th>Status</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of students; let i = index">
                <td>{{ s.user?.name }}</td>
                <td>
                  <select [(ngModel)]="records[i].status">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" style="margin-top:16px" (click)="submit()">
            {{ hasExistingAttendance ? 'Update Attendance' : 'Submit Attendance' }}
          </button>
        </div>
      </div>
    </app-layout>
  `,
})
export class TeacherAttendanceComponent implements OnInit {
  navItems = TEACHER_NAV;
  myClasses: any[] = [];
  selectedClass = '';
  date = new Date().toISOString().split('T')[0];
  students: any[] = [];
  records: any[] = [];
  hasExistingAttendance = false;

  constructor(private auth: AuthService, private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any[]>('/classes').subscribe(classes => {
      this.myClasses = classes.filter(c => c.teacher?.user?.email === this.auth.currentUser?.email);
    });
  }

  loadAttendance(): void {
    if (!this.selectedClass || !this.date) {
      this.students = [];
      this.records = [];
      this.hasExistingAttendance = false;
      return;
    }

    const cls = this.myClasses.find(c => c._id === this.selectedClass);
    this.students = cls?.students || [];
    
    // Default fallback records
    this.records = this.students.map(s => ({ student: s._id, status: 'present', remarks: '' }));
    this.hasExistingAttendance = false;

    // Fetch existing attendance records from backend
    this.api.get<any[]>(`/attendance/class/${this.selectedClass}?date=${this.date}`).subscribe({
      next: (existing) => {
        if (existing && existing.length > 0) {
          this.hasExistingAttendance = true;
          this.records = this.students.map(s => {
            const match = existing.find(e => {
              const matchedStudentId = e.student?._id || e.student;
              return matchedStudentId === s._id;
            });
            return {
              student: s._id,
              status: match ? match.status : 'present',
              remarks: match ? match.remarks : ''
            };
          });
        }
      }
    });
  }

  submit(): void {
    this.api.post('/attendance/bulk', { class: this.selectedClass, date: this.date, records: this.records }).subscribe(() => {
      alert('Attendance saved!');
      this.loadAttendance();
    });
  }
}
