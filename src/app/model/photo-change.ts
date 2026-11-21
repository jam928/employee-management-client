/** What should happen to an employee's photo when their form is saved. */
export type PhotoChange =
  | { kind: 'keep' }
  | { kind: 'replace'; file: File }
  | { kind: 'remove' };
