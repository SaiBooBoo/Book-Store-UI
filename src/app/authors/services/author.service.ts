import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { PageResponse } from "../../shared/models/page.model";
import { Author, AuthorFilter } from "../models/author.model";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { API_ENDPOINTS } from "../../core/constants/api-endpoints";
import { AuthorQueryCriteria, BookQueryCriteria, DataTableInput, DataTableOutput } from "../../shared/models/datatable";
import { Book } from "../../books/model/book.model";

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private readonly API_URL = environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.BASE;

    constructor(private http: HttpClient) { }


    createAuthor(payload: any) {
        return this.http.post(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.CREATE, payload);
    }


    deleteAuthor(authorId: number): Observable<void> {
        return this.http.delete<void>(environment.apiBaseUrl + "/admin/author/delete/" + authorId);
    }

    private baseUrl = 'http://localhost:8080/api/admin/authors';
    datatable (input: DataTableInput<AuthorQueryCriteria>): Observable<DataTableOutput<Author>> {
        return this.http.post<DataTableOutput<Author>>(`${this.baseUrl}/datatable`, input);
    }

    
    checkEmailExists(email: string, excludedId?: number) {
        const query = excludedId?  `?email=${email}&excludeId=${excludedId}` : `?email=${email}`;
        return this.http.get<boolean>(`http://localhost:8080/api/admin/email-exists${query}`);
    }

    getAuthorById(id: number) {
        return this.http.get<any>(`http://localhost:8080/api/admin/author/${id}`)
    }

    updateAuthor(id: number, payload: any) {
        return this.http.put(`http://localhost:8080/api/admin/author/${id}`, payload);
}
}