import { Component } from '@angular/core';
import { EmployeeDialogService } from '../../service/employee-dialog.service';
import { EmployeeStore } from '../../service/employee-store.service';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public menuCollapsed = true;

  constructor(public theme: ThemeService, public store: EmployeeStore, public dialogs: EmployeeDialogService) { }

  get themeToggleLabel(): string {
    return this.theme.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }
}
