import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { environment } from 'src/environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let apiServerUrl = environment.apiBaseUrl;

  const testEmployeeListResponse = {
    content: [
      {
        id: 1,
        name: 'Daniel Soa',
        email: 'daniel@tm.com',
        jobTitle: 'JavaScript',
        phone: '1234567890',
        imageUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png',
        employeeCode: 'a22294f7-6c5b-4498-ab4f-e412fa226756',
      },
      {
        id: 2,
        name: 'Joel Lan',
        email: 'joe@tm.com',
        jobTitle: 'Java',
        phone: '1234567890',
        imageUrl: 'https://bootdey.com/img/Content/avatar/avatar3.png',
        employeeCode: '610d7ef6-8fc0-4eb5-ab30-838982558b65',
      },
      {
        id: 3,
        name: 'Bobby Simpson',
        email: 'bob@tm.com',
        jobTitle: 'Kotlin',
        phone: '1236548790',
        imageUrl: 'https://bootdey.com/img/Content/avatar/avatar7.png',
        employeeCode: 'a602e46d-6ecd-4bf6-9fc3-c505794a38d2',
      },
    ],
    pageable: {
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      offset: 0,
      pageSize: 3,
      pageNumber: 0,
      unpaged: false,
      paged: true,
    },
    totalPages: 1668,
    totalElements: 5003,
    last: false,
    size: 3,
    number: 0,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    numberOfElements: 3,
    first: true,
    empty: false,
  };

  const testSingleEmployee = {
    id: 1,
    name: 'Daniel Soa',
    email: 'daniel@tm.com',
    jobTitle: 'JavaScript',
    phone: '1234567890',
    imageUrl: 'https://bootdey.com/img/Content/avatar/avatar1.png',
    employeeCode: 'a22294f7-6c5b-4498-ab4f-e412fa226756',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('getEmployees() should return list of employees with page metadata', () => {
    service.getEmployees('params').subscribe((res) => {
      expect(res).toEqual(testEmployeeListResponse);
    });
    const params = 'params';
    const req = httpMock.expectOne(`${apiServerUrl}/employee/all?${params}`);
    expect(req.request.method).toBe('GET');
    req.flush(testEmployeeListResponse);
  });

  it('getEmployeeById() should return a single employee', () => {
    const id = 1;
    service.getEmployeeById(id).subscribe((res) => {
      expect(res).toEqual(testSingleEmployee);
    });
    const req = httpMock.expectOne(`${apiServerUrl}/employee/find/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(testSingleEmployee);
  });

  it('addEmployee() should return a employee after adding to the db', () => {
    service.addEmployee(testSingleEmployee).subscribe((res) => {
      expect(res).toEqual(testSingleEmployee);
    });
    const req = httpMock.expectOne(`${apiServerUrl}/employee/add`);
    expect(req.request.method).toBe('POST');
    req.flush(testSingleEmployee);
  });

  it('updateEmployee() should return the updated employee from the api', () => {
    service.updateEmployee(testSingleEmployee).subscribe((res) => {
      expect(res).toEqual(testSingleEmployee);
    });
    const req = httpMock.expectOne(`${apiServerUrl}/employee/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(testSingleEmployee);
  });

  it('deleteEmployee() should return nothing', () => {
    let id = 1;

    service.deleteEmployee(id).subscribe((res) => {
      expect(res).toEqual('Employee Successfully Deleted!');
    });

    const req = httpMock.expectOne(`${apiServerUrl}/employee/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Employee Successfully Deleted!');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
