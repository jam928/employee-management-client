import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { EmployeeFormModalComponent, EmployeeFormResult } from '../components/employee-form-modal/employee-form-modal.component';
import { Employee } from '../model/employee';
import { EmployeeStore } from './employee-store.service';

/** Opens the add, edit and delete dialogs and hands what the user confirmed to the store. */
@Injectable({
  providedIn: 'root'
})
export class EmployeeDialogService {

  constructor(private modal: NgbModal, private store: EmployeeStore) { }

  public openAdd(): void {
    this.onConfirm(this.openForm(null), (result: EmployeeFormResult) =>
      this.store.create(result.details, result.photo));
  }

  public openEdit(employee: Employee): void {
    this.onConfirm(this.openForm(employee), (result: EmployeeFormResult) =>
      this.store.update(employee, result.details, result.photo));
  }

  public openDelete(employee: Employee): void {
    const ref = this.modal.open(ConfirmDialogComponent);
    Object.assign(ref.componentInstance, {
      title: 'Delete Employee',
      message: `Are you sure you want to delete ${employee.name}?`,
      confirmLabel: 'Delete'
    });
    this.onConfirm(ref, () => this.store.remove(employee));
  }

  private openForm(employee: Employee | null): NgbModalRef {
    const ref = this.modal.open(EmployeeFormModalComponent);
    ref.componentInstance.employee = employee;
    return ref;
  }

  private onConfirm<T>(ref: NgbModalRef, action: (result: T) => void): void {
    // A dismissed modal (Close, Esc, backdrop click) rejects; there is nothing to do then
    ref.result.then(action, () => {});
  }
}
