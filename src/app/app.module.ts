import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { EmployeeFormModalComponent } from './components/employee-form-modal/employee-form-modal.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PhotoPickerComponent } from './components/photo-picker/photo-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    ConfirmDialogComponent,
    EmployeeCardComponent,
    EmployeeFormModalComponent,
    EmployeeListComponent,
    NavbarComponent,
    PhotoPickerComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
