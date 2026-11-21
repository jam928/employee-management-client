import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: Theme = 'light';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.apply(this.getInitialTheme());
  }

  public toggle(): void {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.apply(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (e.g. private mode); the theme still applies for this session
    }
  }

  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {}
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(theme: Theme): void {
    this.theme = theme;
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
