import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from './model/employee';
import { EmployeeService } from './service/employee.service';
import * as Rx from 'rxjs';
import { Page } from '../app/model/Page';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AppComponent', () => {
  let employee: Employee;
  let page: Page;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: EmployeeService;
  let testForm: NgForm;
  let errorResponse: HttpErrorResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, FormsModule, NgbModule],
      providers: [EmployeeService],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(EmployeeService);
    testForm = <NgForm>{
      value: employee,
    };
    employee = {
      id: null,
      name: 'Daniel Soa',
      email: 'daniel@tm.com',
      jobTitle: 'JavaScript',
      phone: '1234567890',
      imageUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png',
      employeeCode: 'a22294f7-6c5b-4498-ab4f-e412fa226756',
    };
    page = {
      totalElements: 0,
      content: [employee],
    };
    errorResponse = new HttpErrorResponse({
      error: { code: `some code`, message: `some message.` },
      status: 400,
      statusText: 'Bad Request',
    });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('getsEmployee without email', fakeAsync(() => {
    spyOn(service, 'getEmployees').and.callFake((params: string) => {
      return of(page);
    });
    component.getEmployees(null);
    expect(component.employees).toEqual(page.content);
    expect(component.collectionSize).toEqual(page.totalElements);
  }));

  it('getsEmployee with email', fakeAsync(() => {
    spyOn(service, 'getEmployees').and.callFake((params: string) => {
      return of(page);
    });
    component.getEmployees('email');
    expect(component.employees).toEqual(page.content);
    expect(component.collectionSize).toEqual(page.totalElements);
  }));

  it('getsEmployee with email returns error from api', fakeAsync(() => {
    spyOn(service, 'getEmployees').and.callFake((params: string) => {
      return throwError(errorResponse);
    });
    spyOn(window, 'alert');
    component.getEmployees('email');
    expect(window.alert).toHaveBeenCalledWith(
      'Http failure response for (unknown url): 400 Bad Request'
    );
  }));

  it('saves the employee when the form is submitted to api', fakeAsync(() => {
    spyOn(service, 'addEmployee').and.callFake((employee: Employee) => {
      return Rx.of(employee);
    });
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onAddEmployee(testForm);
    expect(component.getEmployees).toHaveBeenCalled();
  }));

  it('shows alert modal when triggering the save employee api returns error', fakeAsync(() => {
    spyOn(service, 'addEmployee').and.callFake((employee: Employee) => {
      return throwError(errorResponse);
    });
    spyOn(window, 'alert');
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onAddEmployee(testForm);
    expect(window.alert).toHaveBeenCalledWith(
      'Http failure response for (unknown url): 400 Bad Request'
    );
  }));

  it('updates the employee when the form is submitted', fakeAsync(() => {
    spyOn(service, 'updateEmployee').and.callFake((employee: Employee) => {
      return Rx.of(employee);
    });
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onUpdateEmployee(testForm);
    expect(component.getEmployees).toHaveBeenCalled();
  }));

  it('shows alert modal when triggering the update employee api returns error', fakeAsync(() => {
    spyOn(service, 'updateEmployee').and.callFake((employee: Employee) => {
      return throwError(errorResponse);
    });
    spyOn(window, 'alert');
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onUpdateEmployee(testForm);
    expect(window.alert).toHaveBeenCalledWith(
      'Http failure response for (unknown url): 400 Bad Request'
    );
  }));

  it('deletes the employee when its called', fakeAsync(() => {
    spyOn(service, 'deleteEmployee').and.callFake((id: number) => {
      return of('Employee Successfully Deleted!');
    });
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onDeleteEmployee();
    expect(component.getEmployees).toHaveBeenCalled();
  }));

  it('shows alert modal when triggering the delete employee api returns error', fakeAsync(() => {
    spyOn(service, 'deleteEmployee').and.callFake((id: number) => {
      return throwError(errorResponse);
    });
    spyOn(window, 'alert');
    spyOn(component, 'getEmployees').and.callFake((email: string) => {});
    component.onDeleteEmployee();
    expect(window.alert).toHaveBeenCalledWith(
      'Http failure response for (unknown url): 400 Bad Request'
    );
  }));

  it('calls the default employee list if the search key is empty', fakeAsync(() => {
    let key = '';
    spyOn(component, 'getEmployees').and.callFake(
      (email: string) => page.content
    );
    component.onSearchEmployees(key);
    expect(component.getEmployees).toHaveBeenCalledWith(key);
    expect(component.getEmployees).toHaveBeenCalledWith(null);
  }));

  it('does not calls the default employee list if the search key is not empty', fakeAsync(() => {
    let key = 'a';
    spyOn(component, 'getEmployees').and.callFake(
      (email: string) => page.content
    );
    component.onSearchEmployees(key);
    expect(component.getEmployees).toHaveBeenCalledWith(key);
  }));
});
