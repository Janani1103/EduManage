import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <header class="public-header">
      <div class="container">
        <a routerLink="/" class="logo">📚 EduManage</a>
        <nav>
          <a routerLink="/">Home</a>
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/login" class="btn btn-primary btn-sm">Login</a>
        </nav>
      </div>
    </header>
    <section class="content-page">
      <div class="container">
        <h1>Contact Us</h1>
        @if (sent) {
          <div class="alert alert-success">Thank you! We'll get back to you soon.</div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea [(ngModel)]="message" name="message" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
        }
        <div class="contact-info">
          <p>📧 info&#64;edumanage.com</p>
          <p>📞 +94 77 123 4567</p>
          <p>📍 Colombo, Sri Lanka</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @import '../home/home.component.scss';
    .content-page { padding: 64px 24px; max-width: 600px; margin: 0 auto;
      h1 { color: #B22222; margin-bottom: 24px; }
    }
    .contact-form { margin-bottom: 32px; }
    .contact-info p { color: #555; margin: 8px 0; }
  `],
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  sent = false;

  onSubmit(): void {
    this.sent = true;
  }
}
