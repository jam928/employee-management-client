import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Employee, EmployeeDetails } from '../model/employee';
import { Page } from '../model/Page';
import { PhotoChange } from '../model/photo-change';
import { EmployeeService } from './employee.service';
import { NotificationService } from './notification.service';

/** Holds the employee list being shown and refreshes it after every change. */
@Injectable({
  providedIn: 'root'
})
export class EmployeeStore {
  public readonly pageSize = 12;
  public employees: Employee[] = [];
  public totalElements = 0;
  // ng-bootstrap pagination is 1-based, the API is 0-based
  public pageNumber = 1;

  private searchKey = '';
  private readonly reload$ = new Subject<void>();

  constructor(private employeeService: EmployeeService, private notifications: NotificationService) {
    // switchMap drops responses that arrive after a newer request (e.g. while typing a search)
    this.reload$.pipe(
      switchMap(() => this.employeeService.getEmployees(this.queryParams()).pipe(
        catchError((error: HttpErrorResponse) => {
          this.notifications.showError(error);
          return EMPTY;
        })
      ))
    ).subscribe((response: Page) => {
      this.employees = response.content;
      this.totalElements = response.page.totalElements;
    });
  }

  public load(): void {
    this.reload$.next();
  }

  public search(key: string): void {
    this.searchKey = key.trim();
    this.pageNumber = 1;
    this.load();
  }

  public goToPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.load();
  }

  public create(details: EmployeeDetails, photo: PhotoChange): void {
    this.employeeService.addEmployee(details as Employee).pipe(
      // The employee needs an id before its photo can be uploaded
      switchMap((created: Employee) => this.applyPhotoChange(created, photo))
    ).subscribe(() => this.load(), (error: HttpErrorResponse) => this.fail(error));
  }

  public update(original: Employee, details: EmployeeDetails, photo: PhotoChange): void {
    // The API overwrites every field, so keep id, employeeCode and the current imageUrl
    const employee: Employee = { ...original, ...details };
    this.employeeService.updateEmployee(employee).pipe(
      switchMap((updated: Employee) => this.applyPhotoChange({ ...employee, ...updated }, photo))
    ).subscribe(() => this.load(), (error: HttpErrorResponse) => this.fail(error));
  }

  public remove(employee: Employee): void {
    this.employeeService.deleteEmployee(employee.id)
      .subscribe(() => this.load(), (error: HttpErrorResponse) => this.fail(error));
  }

  private applyPhotoChange(employee: Employee, photo: PhotoChange): Observable<Employee> {
    switch (photo.kind) {
      case 'replace':
        return this.employeeService.uploadEmployeeImage(employee.id, photo.file);
      case 'remove':
        return employee.imageUrl ? this.employeeService.removeEmployeeImage(employee.id) : of(employee);
      default:
        return of(employee);
    }
  }

  private queryParams(): string {
    let params = `pageSize=${this.pageSize}&pageNumber=${this.pageNumber - 1}`;
    if (this.searchKey) {
      params += `&email=${encodeURIComponent(this.searchKey)}`;
    }
    return params;
  }

  /** Shows the error, then reloads since part of the change (e.g. the employee but not the photo) may have saved. */
  private fail(error: HttpErrorResponse): void {
    this.notifications.showError(error);
    this.load();
  }
}
