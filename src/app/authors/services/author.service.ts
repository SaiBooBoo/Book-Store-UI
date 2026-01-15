import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { PageResponse } from "../../shared/models/page.model";
import { Author } from "../models/author.model";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { API_ENDPOINTS } from "../../core/constants/api-endpoints";

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private readonly API_URL = environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.BASE;

    constructor(private http: HttpClient) {}

        getAuthors(
            page: number = 0,
            size: number = 5,
            sortBy: string = 'id',
            direction: string = 'asc'
        ) : Observable<PageResponse<Author>> {

            const params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sortBy', sortBy)
            .set('direction', direction);
            return this.http.get<PageResponse<Author>>(this.API_URL, {params});
        }

    createAuthor(payload: any) {
        return this.http.post(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.CREATE, payload);
    }
    
       
    deleteAuthor(authorId: number): Observable<void> {
        return this.http.delete<void>(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.AUTHORS.DELETE(authorId));
    }
}