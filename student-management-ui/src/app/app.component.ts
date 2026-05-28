import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar></app-navbar>
      <main class="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
        <router-outlet></router-outlet>
      </main>
      <footer class="bg-gradient-to-r from-blue-700 to-indigo-800 
                     text-center py-4">
        <p class="text-blue-200 text-sm">
          🎓 Student Management System &nbsp;·&nbsp;
          Built with 
          <span class="text-white font-semibold">Angular 21</span>
          &nbsp;+&nbsp;
          <span class="text-white font-semibold">.NET 10</span>
          &nbsp;+&nbsp;
          <span class="text-white font-semibold">Azure</span>
        </p>
      </footer>
    </div>
  `
})
export class AppComponent {}