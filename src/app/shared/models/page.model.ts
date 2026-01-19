
export interface PageResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        queryCriteria?: T;
        totalElements: number;
        totalPages: number;
    }
   
}