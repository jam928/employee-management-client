import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /** Alerts the API's own error text when it sent one (e.g. why an image was rejected). */
  public showError(error: HttpErrorResponse): void {
    window.alert(typeof error.error === 'string' && error.error ? error.error : error.message);
  }
}
