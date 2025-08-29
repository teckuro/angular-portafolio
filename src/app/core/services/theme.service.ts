import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('dark');
  public currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    // Cargar tema guardado en localStorage o usar dark por defecto
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('dark');
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    
    // Aplicar tema al documento
    if (theme === 'dark') {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}
