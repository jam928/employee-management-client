import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { environment } from 'src/environments/environment';
import { Page } from '../model/Page';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getEmployees(params: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiServerUrl}/employee/all?${params}`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update/${employee.id}`, employee);
  }

  /** Uploads or replaces the employee's photo; the API stores it in MinIO and returns the updated employee. */
  public uploadEmployeeImage(id: number, file: File): Observable<Employee> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/${id}/image`, formData);
  }

  public removeEmployeeImage(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiServerUrl}/employee/${id}/image`);
  }

  public deleteEmployee(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiServerUrl}/employee/delete/${id}`);
  }

  public getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiServerUrl}/employee/find/${id}`);
  }
}
