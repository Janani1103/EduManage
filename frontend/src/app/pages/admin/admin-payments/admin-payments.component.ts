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
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout [navItems]="navItems">
      <div class="page-header"><h1>Payments</h1><p>Manage course fees and payments</p></div>
      <div class="card">
        <div class="card-header"><h3>Payment Records</h3><button class="btn btn-primary" (click)="openModal()">+ Add Payment</button></div>
        <div class="table-container" *ngIf="payments.length">
          <table>
            <thead><tr><th>Student</th><th>Class</th><th>Amount</th><th>Month</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td>{{ p.student?.user?.name }}</td>
                <td>{{ p.class?.name || '-' }}</td>
                <td>Rs. {{ p.amount }}</td>
                <td>{{ p.month || '-' }}</td>
                <td><span class="badge" [ngClass]="{'badge-success': p.status==='paid', 'badge-warning': p.status==='pending', 'badge-danger': p.status==='overdue'}">{{ p.status }}</span></td>
                <td><button *ngIf="p.status!=='paid'" class="btn btn-primary btn-sm" (click)="markPaid(p._id)">Mark Paid</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-layout>
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>Add Payment</h2>
        <div class="form-group"><label>Student</label>
          <select [(ngModel)]="form.student"><option *ngFor="let s of students" [value]="s._id">{{ s.user?.name }}</option></select>
        </div>
        <div class="form-group"><label>Class</label>
          <select [(ngModel)]="form.class" (change)="onClassChange()"><option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option></select>
        </div>
        <div class="form-group"><label>Amount</label><input type="number" [(ngModel)]="form.amount"></div>
        <div class="form-group"><label>Month</label><input [(ngModel)]="form.month" placeholder="January 2024"></div>
        <button class="btn btn-primary" (click)="save()">Save</button>
        <button class="btn btn-outline" (click)="showModal=false">Cancel</button>
      </div>
    </div>
  `,
})
export class AdminPaymentsComponent implements OnInit {
  navItems = ADMIN_NAV;
  payments: any[] = [];
  students: any[] = [];
  classes: any[] = [];
  showModal = false;
  form: any = { amount: 0, status: 'pending' };

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.load();
    this.api.get<any[]>('/students').subscribe(d => this.students = d);
    this.api.get<any[]>('/classes').subscribe(d => this.classes = d);
  }
  load(): void { this.api.get<any[]>('/payments').subscribe(d => this.payments = d); }
  
  openModal(): void {
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthYear = `${months[now.getMonth()]} ${now.getFullYear()}`;
    
    this.form = {
      student: this.students.length ? this.students[0]._id : '',
      class: this.classes.length ? this.classes[0]._id : '',
      amount: this.classes.length ? this.classes[0].fee : 0,
      month: currentMonthYear,
      status: 'pending'
    };
    this.showModal = true;
  }

  onClassChange(): void {
    const selectedClass = this.classes.find(c => c._id === this.form.class);
    if (selectedClass) {
      this.form.amount = selectedClass.fee || 0;
    }
  }

  save(): void { this.api.post('/payments', this.form).subscribe(() => { this.showModal = false; this.load(); }); }
  markPaid(id: string): void { this.api.put(`/payments/${id}/pay`, { paymentMethod: 'cash' }).subscribe(() => this.load()); }
}
