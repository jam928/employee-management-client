import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Employee, EmployeeDetails } from '../model/employee';
import { Page } from '../model/Page';
import { EmployeeStore } from './employee-store.service';
import { EmployeeService } from './employee.service';
import { NotificationService } from './notification.service';

describe('EmployeeStore', () => {
  let store: EmployeeStore;
  let api: EmployeeService;
  let notifications: NotificationService;

  const employee: Employee = {
    id: 7,
    name: 'Daniel Soa',
    email: 'daniel@tm.com',
    jobTitle: 'JavaScript',
    phone: '1234567890',
    imageUrl: 'http://localhost:9000/employee-images/a.png',
    employeeCode: 'a22294f7-6c5b-4498-ab4f-e412fa226756',
  };
  const details: EmployeeDetails = { name: 'New Name', email: 'n@tm.com', jobTitle: 'Dev', phone: '1' };
  const page: Page = { content: [employee], page: { size: 12, number: 0, totalElements: 1, totalPages: 1 } };
  const png = () => new File(['png'], 'avatar.png', { type: 'image/png' });
  const errorResponse = new HttpErrorResponse({ error: { code: 'x' }, status: 400, statusText: 'Bad Request' });

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    store = TestBed.inject(EmployeeStore);
    api = TestBed.inject(EmployeeService);
    notifications = TestBed.inject(NotificationService);
    spyOn(notifications, 'showError');
    spyOn(api, 'getEmployees').and.returnValue(of(page));
  });

  describe('listing', () => {
    it('loads the current page', () => {
      store.load();
      expect(api.getEmployees).toHaveBeenCalledWith('pageSize=12&pageNumber=0');
      expect(store.employees).toEqual(page.content);
      expect(store.totalElements).toEqual(1);
    });

    it('searches by email from the first page and keeps the search while paging', () => {
      store.goToPage(3);
      store.search(' dan@tm.com ');
      expect(store.pageNumber).toEqual(1);
      expect(api.getEmployees).toHaveBeenCalledWith('pageSize=12&pageNumber=0&email=dan%40tm.com');

      store.goToPage(2);
      expect(api.getEmployees).toHaveBeenCalledWith('pageSize=12&pageNumber=1&email=dan%40tm.com');
    });

    it('lists everyone again when the search is cleared', () => {
      store.search('dan');
      store.search('');
      expect(api.getEmployees).toHaveBeenCalledWith('pageSize=12&pageNumber=0');
    });

    it('shows the error when loading fails and keeps working afterwards', () => {
      (api.getEmployees as jasmine.Spy).and.returnValues(throwError(errorResponse), of(page));
      store.load();
      expect(notifications.showError).toHaveBeenCalledWith(errorResponse);
      store.load();
      expect(store.employees).toEqual(page.content);
    });
  });

  describe('create', () => {
    it('uploads the photo after creating the employee', () => {
      spyOn(api, 'addEmployee').and.returnValue(of({ ...employee, id: 42 }));
      spyOn(api, 'uploadEmployeeImage').and.returnValue(of(employee));
      store.create(details, { kind: 'replace', file: png() });
      expect(api.addEmployee).toHaveBeenCalledWith(jasmine.objectContaining(details));
      expect(api.uploadEmployeeImage).toHaveBeenCalledWith(42, jasmine.any(File));
      expect(api.getEmployees).toHaveBeenCalled();
    });

    it('does not upload when there is no photo', () => {
      spyOn(api, 'addEmployee').and.returnValue(of(employee));
      spyOn(api, 'uploadEmployeeImage');
      store.create(details, { kind: 'keep' });
      expect(api.uploadEmployeeImage).not.toHaveBeenCalled();
      expect(api.getEmployees).toHaveBeenCalled();
    });

    it('shows the error and reloads when saving fails', () => {
      spyOn(api, 'addEmployee').and.returnValue(of(employee));
      spyOn(api, 'uploadEmployeeImage').and.returnValue(throwError(errorResponse));
      store.create(details, { kind: 'replace', file: png() });
      expect(notifications.showError).toHaveBeenCalledWith(errorResponse);
      expect(api.getEmployees).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    beforeEach(() => spyOn(api, 'updateEmployee').and.callFake((e: Employee) => of(e)));

    it('keeps id, employeeCode and the current imageUrl', () => {
      store.update(employee, details, { kind: 'keep' });
      expect(api.updateEmployee).toHaveBeenCalledWith({ ...employee, ...details });
      expect(api.getEmployees).toHaveBeenCalled();
    });

    it('uploads a new photo after updating', () => {
      spyOn(api, 'uploadEmployeeImage').and.returnValue(of(employee));
      spyOn(api, 'removeEmployeeImage');
      store.update(employee, details, { kind: 'replace', file: png() });
      expect(api.uploadEmployeeImage).toHaveBeenCalledWith(7, jasmine.any(File));
      expect(api.removeEmployeeImage).not.toHaveBeenCalled();
    });

    it('removes the photo when asked to', () => {
      spyOn(api, 'removeEmployeeImage').and.returnValue(of(employee));
      store.update(employee, details, { kind: 'remove' });
      expect(api.removeEmployeeImage).toHaveBeenCalledWith(7);
    });

    it('skips removing when the employee has no photo', () => {
      spyOn(api, 'removeEmployeeImage');
      store.update({ ...employee, imageUrl: null }, details, { kind: 'remove' });
      expect(api.removeEmployeeImage).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the employee and reloads', () => {
      spyOn(api, 'deleteEmployee').and.returnValue(of('Employee Successfully Deleted!'));
      store.remove(employee);
      expect(api.deleteEmployee).toHaveBeenCalledWith(7);
      expect(api.getEmployees).toHaveBeenCalled();
    });

    it('shows the error when deleting fails', () => {
      spyOn(api, 'deleteEmployee').and.returnValue(throwError(errorResponse));
      store.remove(employee);
      expect(notifications.showError).toHaveBeenCalledWith(errorResponse);
    });
  });
});
