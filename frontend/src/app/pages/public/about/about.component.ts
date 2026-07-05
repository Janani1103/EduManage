import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
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
        <h1>About EduManage</h1>
        <p>EduManage is a comprehensive web-based Teaching Service Management System designed for private tuition centers and teaching institutes.</p>
        <h2>Our Mission</h2>
        <p>To simplify educational administration by providing an integrated platform for managing all aspects of teaching services — from enrollment to examination results.</p>
        <h2>Technology</h2>
        <p>Built with Angular, Node.js, Express, MongoDB, and JWT authentication for a secure, scalable solution.</p>
      </div>
    </section>
  `,
  styles: [`
    @import '../home/home.component.scss';
    .content-page { padding: 64px 24px; max-width: 800px; margin: 0 auto;
      h1 { color: #B22222; margin-bottom: 16px; }
      h2 { color: #2C3E50; margin: 24px 0 12px; }
      p { color: #555; line-height: 1.8; margin-bottom: 12px; }
    }
  `],
})
export class AboutComponent {}
