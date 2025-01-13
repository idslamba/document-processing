import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme: string = 'indigo-pink';

  setTheme(theme: string) {
    this.currentTheme = theme;
    document.body.classList.remove('indigo-pink', 'deeppurple-amber', 'pink-bluegrey', 'purple-green');
    document.body.classList.add(this.currentTheme);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  constructor() { }
}
