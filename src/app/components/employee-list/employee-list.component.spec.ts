import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Employee } from '../../model/employee';
import { EmployeeDialogService } from '../../service/employee-dialog.service';
import { EmployeeStore } from '../../service/employee-store.service';
import { EmployeeListComponent } from './employee-list.component';

describe('EmployeeListComponent', () => {
  let fixture: ComponentFixture<EmployeeListComponent>;
  let store: any;

  beforeEach(async () => {
    store = { pageSize: 12, pageNumber: 1, employees: [], totalElements: 0, load: jasmine.createSpy('load') };
    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        { provide: EmployeeStore, useValue: store },
        { provide: EmployeeDialogService, useValue: jasmine.createSpyObj('EmployeeDialogService', ['openAdd']) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeListComponent);
  });

  it('loads employees on init', () => {
    fixture.detectChanges();
    expect(store.load).toHaveBeenCalled();
  });

  it('shows a card per employee and hides the empty state', () => {
    store.employees = [{ id: 1 } as Employee, { id: 2 } as Employee];
    store.totalElements = 2;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('app-employee-card').length).toEqual(2);
    expect(element.querySelector('.empty-state')).toBeNull();
    expect(element.querySelector('.list-subtitle').textContent.trim()).toEqual('2 employees');
  });

  it('shows the empty state when there are no employees', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
  });
});
