import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeDialogService } from '../../service/employee-dialog.service';
import { EmployeeStore } from '../../service/employee-store.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(public store: EmployeeStore, public dialogs: EmployeeDialogService) { }

  ngOnInit(): void {
    this.store.load();
  }

  public trackById(_: number, employee: Employee): number {
    return employee.id;
  }
}
