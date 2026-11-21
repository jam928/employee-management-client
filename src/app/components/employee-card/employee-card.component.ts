import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css']
})
export class EmployeeCardComponent {
  @Input() employee: Employee;
  @Output() edit = new EventEmitter<Employee>();
  @Output() remove = new EventEmitter<Employee>();
}
