import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './model/employee';
import { Page } from './model/Page';
import { EmployeeService } from './service/employee.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee;

  pageSize: number = 12;
  pageNumber: number = 1;
  collectionSize: number;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees(null);
  }

  public getEmployees(email: string): void {
    let params = `pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`;
    if(email) {
      params += "&email="+email;
    }
    this.employeeService.getEmployees(params).subscribe((response: Page) => {      
        console.log(response);
        this.employees = response.content;
        this.collectionSize=response.totalElements;
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  public onOpenModal(employee: Employee, mode: String): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    
    if(mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    } else if(mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');
    } else {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm) : void {
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe((response: Employee) => {
      console.log(response);
      this.getEmployees(null);
    },(error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  public onUpdateEmployee(editForm: NgForm) : void {
    document.getElementById('edit-employee-form').click();
    editForm.value.id = this.editEmployee?.id;
    editForm.value.employeeCode = this.editEmployee?.employeeCode;
    this.employeeService.updateEmployee(editForm.value).subscribe((response: Employee) => {
      console.log(response);
      this.getEmployees(null);
    },(error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  public onDeleteEmployee() : void {
    this.employeeService.deleteEmployee(this.editEmployee?.id).subscribe((response) => {
      console.log(response);
      document.getElementById('delete-employee-form').click();
      this.getEmployees(null);
    },(error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  public onSearchEmployees(key: string) : void {
    this.getEmployees(key);
    // Reset if the filter didnt return results or the input string is empty
    if(this.employees.length === 0 || !key) {
      this.getEmployees(null);
    }
  }
  
}
