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
  selector: 'app-admin-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Subjects</h1><p>Manage academic subjects</p></div>
      <div class="card">
        <div class="card-header"><h3>All Subjects</h3><button class="btn btn-primary" (click)="showModal=true; form={}">+ Add Subject</button></div>
        <div class="table-container" *ngIf="subjects.length">
          <table>
            <thead><tr><th>Code</th><th>Name</th><th>Credits</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of subjects">
                <td>{{ s.code }}</td><td>{{ s.name }}</td><td>{{ s.credits }}</td>
                <td><button class="btn btn-danger btn-sm" (click)="remove(s._id)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Add Subject</h2>
        <div class="form-group"><label>Name</label><input [(ngModel)]="form.name"></div>
        <div class="form-group"><label>Code</label><input [(ngModel)]="form.code"></div>
        <div class="form-group"><label>Description</label><textarea [(ngModel)]="form.description"></textarea></div>
        <div class="form-group"><label>Credits</label><input type="number" [(ngModel)]="form.credits"></div>
        <button class="btn btn-primary" (click)="save()">Save</button>
        <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class AdminSubjectsComponent implements OnInit {
  navItems = ADMIN_NAV;
  subjects: any[] = [];
  showModal = false;
  form: any = {};

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.get<any[]>('/subjects').subscribe(d => this.subjects = d); }
  save(): void { this.api.post('/subjects', this.form).subscribe(() => { this.showModal = false; this.load(); }); }
  remove(id: string): void { if (confirm('Delete?')) this.api.delete(`/subjects/${id}`).subscribe(() => this.load()); }
}
