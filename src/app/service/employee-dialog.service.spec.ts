import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Employee, EmployeeDetails } from '../model/employee';
import { EmployeeDialogService } from './employee-dialog.service';
import { EmployeeStore } from './employee-store.service';

describe('EmployeeDialogService', () => {
  let dialogs: EmployeeDialogService;
  let store: jasmine.SpyObj<EmployeeStore>;
  let modal: jasmine.SpyObj<NgbModal>;
  let componentInstance: any;

  const employee = { id: 7, name: 'Daniel Soa' } as Employee;
  const details: EmployeeDetails = { name: 'New Name', email: 'n@tm.com', jobTitle: 'Dev', phone: '1' };
  const resolveWith = (result: Promise<any>) => {
    componentInstance = {};
    modal.open.and.returnValue({ componentInstance, result } as NgbModalRef);
  };

  beforeEach(() => {
    store = jasmine.createSpyObj('EmployeeStore', ['create', 'update', 'remove']);
    modal = jasmine.createSpyObj('NgbModal', ['open']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EmployeeStore, useValue: store },
        { provide: NgbModal, useValue: modal },
      ],
    });
    dialogs = TestBed.inject(EmployeeDialogService);
  });

  it('creates the employee when the add form is saved', async () => {
    const result = Promise.resolve({ details, photo: { kind: 'keep' } });
    resolveWith(result);
    dialogs.openAdd();
    await result;
    expect(componentInstance.employee).toBeNull();
    expect(store.create).toHaveBeenCalledWith(details, { kind: 'keep' });
  });

  it('updates the employee when the edit form is saved', async () => {
    const result = Promise.resolve({ details, photo: { kind: 'remove' } });
    resolveWith(result);
    dialogs.openEdit(employee);
    await result;
    expect(componentInstance.employee).toBe(employee);
    expect(store.update).toHaveBeenCalledWith(employee, details, { kind: 'remove' });
  });

  it('deletes the employee once confirmed', async () => {
    const result = Promise.resolve();
    resolveWith(result);
    dialogs.openDelete(employee);
    await result;
    expect(componentInstance.message).toContain('Daniel Soa');
    expect(store.remove).toHaveBeenCalledWith(employee);
  });

  it('does nothing when a dialog is dismissed', async () => {
    const result = Promise.reject('dismissed');
    resolveWith(result);
    dialogs.openDelete(employee);
    await result.catch(() => {});
    expect(store.remove).not.toHaveBeenCalled();
  });
});
