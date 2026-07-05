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
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './admin-students.component.html',
})
export class AdminStudentsComponent implements OnInit {
  navItems = ADMIN_NAV;
  students: any[] = [];
  classes: any[] = [];
  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedStudent: any = null;
  form: any = {};
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
    this.loadClasses();
  }

  load(): void {
    this.api.get<any[]>('/students').subscribe({
      next: (d) => { this.students = d; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadClasses(): void {
    this.api.get<any[]>('/classes').subscribe({
      next: (d) => { this.classes = d; },
    });
  }

  onClassSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const classId = selectElement.value;
    if (classId) {
      if (!this.form.enrolledClasses) {
        this.form.enrolledClasses = [];
      }
      if (!this.form.enrolledClasses.includes(classId)) {
        this.form.enrolledClasses.push(classId);
      }
      selectElement.value = '';
    }
  }

  removeClass(classId: string): void {
    if (this.form.enrolledClasses) {
      const idx = this.form.enrolledClasses.indexOf(classId);
      if (idx > -1) {
        this.form.enrolledClasses.splice(idx, 1);
      }
    }
  }

  getClassName(classId: string): string {
    const cls = this.classes.find(c => c._id === classId);
    if (!cls) return '';
    return cls.subject ? `${cls.name} (${cls.subject.name})` : cls.name;
  }

  isClassSelected(classId: string): boolean {
    return this.form.enrolledClasses && this.form.enrolledClasses.includes(classId);
  }

  openModal(): void {
    this.modalMode = 'add';
    this.selectedStudent = null;
    this.form = { name: '', email: '', password: '', phone: '', grade: '', dateOfBirth: '', parentName: '', parentPhone: '', address: '', enrolledClasses: [] };
    this.showModal = true;
  }

  viewStudent(student: any): void {
    this.modalMode = 'view';
    this.selectedStudent = student;
    this.showModal = true;
  }

  editStudent(student: any): void {
    this.modalMode = 'edit';
    this.selectedStudent = student;
    this.form = {
      name: student.user?.name || '',
      email: student.user?.email || '',
      phone: student.user?.phone || '',
      grade: student.grade || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      address: student.address || '',
      enrolledClasses: student.enrolledClasses ? student.enrolledClasses.map((c: any) => c._id || c) : [],
    };
    this.showModal = true;
  }

  save(): void {
    if (this.modalMode === 'add') {
      this.api.post('/students', this.form).subscribe({
        next: () => { this.showModal = false; this.load(); },
      });
    } else if (this.modalMode === 'edit' && this.selectedStudent) {
      this.api.put(`/students/${this.selectedStudent._id}`, this.form).subscribe({
        next: () => { this.showModal = false; this.load(); },
      });
    }
  }

  toggleStatus(student: any): void {
    const action = student.user?.isActive ? 'Deactivate' : 'Activate';
    if (confirm(`${action} this student?`)) {
      if (student.user?.isActive) {
        this.api.delete(`/students/${student._id}`).subscribe(() => this.load());
      } else {
        this.api.put(`/users/${student.user._id}/toggle`, {}).subscribe(() => this.load());
      }
    }
  }
}
