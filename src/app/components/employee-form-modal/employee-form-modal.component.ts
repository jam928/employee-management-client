import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee, EmployeeDetails } from '../../model/employee';
import { PhotoChange } from '../../model/photo-change';

export interface EmployeeFormResult {
  details: EmployeeDetails;
  photo: PhotoChange;
}

/** The add/edit employee form; closes with an EmployeeFormResult when saved. */
@Component({
  selector: 'app-employee-form-modal',
  templateUrl: './employee-form-modal.component.html'
})
export class EmployeeFormModalComponent {
  public details: EmployeeDetails = { name: '', email: '', jobTitle: '', phone: '' };
  private photo: PhotoChange = { kind: 'keep' };
  private _employee: Employee | null = null;

  constructor(public activeModal: NgbActiveModal) { }

  /** The employee being edited, or null when adding a new one. */
  @Input()
  set employee(employee: Employee | null) {
    this._employee = employee;
    if (employee) {
      const { name, email, jobTitle, phone } = employee;
      this.details = { name, email, jobTitle, phone };
    }
  }
  get employee(): Employee | null {
    return this._employee;
  }

  public onPhotoChange(photo: PhotoChange): void {
    this.photo = photo;
  }

  public save(): void {
    const result: EmployeeFormResult = { details: { ...this.details }, photo: this.photo };
    this.activeModal.close(result);
  }
}
