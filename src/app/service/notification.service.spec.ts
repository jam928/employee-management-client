import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  const service = new NotificationService();

  beforeEach(() => spyOn(window, 'alert'));

  it('alerts the API error text when there is one', () => {
    service.showError(new HttpErrorResponse({ error: 'Unsupported image type', status: 400 }));
    expect(window.alert).toHaveBeenCalledWith('Unsupported image type');
  });

  it('falls back to the HTTP error message', () => {
    service.showError(new HttpErrorResponse({ error: { code: 'x' }, status: 400, statusText: 'Bad Request' }));
    expect(window.alert).toHaveBeenCalledWith('Http failure response for (unknown url): 400 Bad Request');
  });
});
