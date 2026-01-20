import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { PageResponse } from "../../shared/models/page.model";
import { Author, AuthorFilter } from "../models/author.model";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { API_ENDPOINTS } from "../../core/constants/api-endpoints";
import { AuthorQueryCriteria, DataTableInput, DataTableOutput } from "../../shared/models/datatable";

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private readonly API_URL = environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.BASE;

    constructor(private http: HttpClient) {}


    createAuthor(payload: any) {
        return this.http.post(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.CREATE, payload);
    }
    

    deleteAuthor(authorId: number) : Observable<void> {
        return this.http.delete<void>(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.DELETE(authorId));
    }

    datatable(input: DataTableInput<AuthorQueryCriteria>): Observable<DataTableOutput<Author>> {
        return this.http.post<DataTableOutput<Author>>(this.API_URL+ '/datatable', input); 
    }




}