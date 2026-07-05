import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent, NavItem } from '../../../shared/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
    { label: 'Teachers', route: '/admin/teachers', icon: '👨‍🏫' },
    { label: 'Students', route: '/admin/students', icon: '👨‍🎓' },
    { label: 'Subjects', route: '/admin/subjects', icon: '📖' },
    { label: 'Classes', route: '/admin/classes', icon: '🏫' },
    { label: 'Payments', route: '/admin/payments', icon: '💰' },
    { label: 'Reports', route: '/admin/reports', icon: '📈' },
  ];

  stats: any = {};
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/reports/dashboard').subscribe({
      next: (data: Record<string, unknown>) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
