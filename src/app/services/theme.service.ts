import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _currentTheme: string = localStorage.getItem('theme') === null ? 'dark' : localStorage.getItem('theme') as string;

  get currentTheme(): string {
    return this._currentTheme;
  }

  set currentTheme(value: string) {
    this._currentTheme = value;
    localStorage.setItem('theme', value);
  }

  constructor() { }
}
