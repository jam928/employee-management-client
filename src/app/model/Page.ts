import { Employee } from "./employee";

export interface PageMetadata {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface Page {
    content: Employee[];
    page: PageMetadata;
}
