export interface Author {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    bio?: string;
}

export interface AuthorFilter {
    firstName?: string;
    lastName?: string;
    email?: string;
}