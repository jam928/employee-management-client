import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  it('applies the saved theme', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dark');
    const service = TestBed.inject(ThemeService);
    expect(service.theme).toEqual('dark');
    expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
  });

  it('toggle switches theme, updates <html> and saves the choice', () => {
    spyOn(localStorage, 'getItem').and.returnValue('light');
    spyOn(localStorage, 'setItem');
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.theme).toEqual('dark');
    expect(document.documentElement.getAttribute('data-theme')).toEqual('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    service.toggle();
    expect(service.theme).toEqual('light');
    expect(document.documentElement.getAttribute('data-theme')).toEqual('light');
  });
});
