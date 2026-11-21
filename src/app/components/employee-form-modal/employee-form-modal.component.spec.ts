import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../../model/employee';
import { EmployeeFormModalComponent } from './employee-form-modal.component';

describe('EmployeeFormModalComponent', () => {
  let component: EmployeeFormModalComponent;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  const employee: Employee = {
    id: 7, name: 'Daniel Soa', email: 'daniel@tm.com', jobTitle: 'JavaScript', phone: '1234567890',
    imageUrl: 'http://localhost:9000/employee-images/a.png', employeeCode: 'abc',
  };

  beforeEach(async () => {
    activeModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    await TestBed.configureTestingModule({
      declarations: [EmployeeFormModalComponent],
      imports: [FormsModule],
      providers: [{ provide: NgbActiveModal, useValue: activeModal }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    component = TestBed.createComponent(EmployeeFormModalComponent).componentInstance;
  });

  it('starts empty when adding', () => {
    component.employee = null;
    expect(component.details).toEqual({ name: '', email: '', jobTitle: '', phone: '' });
  });

  it('prefills the details when editing', () => {
    component.employee = employee;
    expect(component.details).toEqual({ name: 'Daniel Soa', email: 'daniel@tm.com', jobTitle: 'JavaScript', phone: '1234567890' });
  });

  it('closes with the details and photo change when saved', () => {
    component.employee = employee;
    component.details.name = 'New Name';
    component.onPhotoChange({ kind: 'remove' });
    component.save();
    expect(activeModal.close).toHaveBeenCalledWith({
      details: { name: 'New Name', email: 'daniel@tm.com', jobTitle: 'JavaScript', phone: '1234567890' },
      photo: { kind: 'remove' },
    });
  });

  it('keeps the photo when it was not touched', () => {
    component.save();
    expect(activeModal.close).toHaveBeenCalledWith(jasmine.objectContaining({ photo: { kind: 'keep' } }));
  });
});
