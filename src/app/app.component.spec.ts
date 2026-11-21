import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders the navbar and the employee list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-navbar')).toBeTruthy();
    expect(element.querySelector('app-employee-list')).toBeTruthy();
  });
});
