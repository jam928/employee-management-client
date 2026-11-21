export interface Employee {
    id: number;
    name: string;
    email: string;
    jobTitle: string;
    phone: string;
    imageUrl: string;
    employeeCode: string;
}

/** The fields a user edits in the employee form. */
export type EmployeeDetails = Pick<Employee, 'name' | 'email' | 'jobTitle' | 'phone'>;
