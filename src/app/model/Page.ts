import { Employee } from "./employee";

export interface Page {
    totalElements: number;
    content: Employee[]
}