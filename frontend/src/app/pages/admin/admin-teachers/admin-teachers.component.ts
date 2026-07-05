import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './admin-teachers.component.html',
})
export class AdminTeachersComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
    { label: 'Teachers', route: '/admin/teachers', icon: '👨‍🏫' },
    { label: 'Students', route: '/admin/students', icon: '👨‍🎓' },
    { label: 'Subjects', route: '/admin/subjects', icon: '📖' },
    { label: 'Classes', route: '/admin/classes', icon: '🏫' },
    { label: 'Payments', route: '/admin/payments', icon: '💰' },
    { label: 'Reports', route: '/admin/reports', icon: '📈' },
  ];

  teachers: any[] = [];
  subjects: any[] = [];
  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedTeacher: any = null;
  form: any = { name: '', email: '', password: '', phone: '', qualification: '', specialization: '', salary: 0, bio: '', subjects: [] };
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.api.get<any[]>('/subjects').subscribe((s: unknown[]) => this.subjects = s);
  }

  loadTeachers(): void {
    this.api.get<any[]>('/teachers').subscribe({
      next: (data: unknown[]) => { this.teachers = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openModal(): void {
    this.modalMode = 'add';
    this.selectedTeacher = null;
    this.form = { name: '', email: '', password: '', phone: '', qualification: '', specialization: '', salary: 0, bio: '', subjects: [] };
    this.showModal = true;
  }

  viewTeacher(teacher: any): void {
    this.modalMode = 'view';
    this.selectedTeacher = teacher;
    this.showModal = true;
  }

  editTeacher(teacher: any): void {
    this.modalMode = 'edit';
    this.selectedTeacher = teacher;
    this.form = {
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      password: '',
      phone: teacher.user?.phone || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
      salary: teacher.salary || 0,
      bio: teacher.bio || '',
      subjects: teacher.subjects ? teacher.subjects.map((s: any) => typeof s === 'string' ? s : s._id) : []
    };
    this.showModal = true;
  }

  toggleSubject(subjectId: string): void {
    if (!this.form.subjects) {
      this.form.subjects = [];
    }
    const idx = this.form.subjects.indexOf(subjectId);
    if (idx > -1) {
      this.form.subjects.splice(idx, 1);
    } else {
      this.form.subjects.push(subjectId);
    }
  }

  isSubjectSelected(subjectId: string): boolean {
    return this.form.subjects && this.form.subjects.includes(subjectId);
  }

  save(): void {
    if (this.modalMode === 'add') {
      this.api.post('/teachers', this.form).subscribe({
        next: () => { this.showModal = false; this.loadTeachers(); },
      });
    } else if (this.modalMode === 'edit' && this.selectedTeacher) {
      this.api.put(`/teachers/${this.selectedTeacher._id}`, this.form).subscribe({
        next: () => { this.showModal = false; this.loadTeachers(); },
      });
    }
  }

  toggleStatus(teacher: any): void {
    const action = teacher.user?.isActive ? 'Deactivate' : 'Activate';
    if (confirm(`${action} this teacher?`)) {
      if (teacher.user?.isActive) {
        this.api.delete(`/teachers/${teacher._id}`).subscribe(() => this.loadTeachers());
      } else {
        this.api.put(`/users/${teacher.user._id}/toggle`, {}).subscribe(() => this.loadTeachers());
      }
    }
  }
}
