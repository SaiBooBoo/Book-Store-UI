import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PageResponse } from "../../shared/components/page.model";
import { Author } from "../models/author.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private readonly API_URL = 'http://localhost:8080/api/admin/authors';

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

        private CREATE_URL = "http://localhost:8080/api/admin/new/author"
    createAuthor(payload: any) {
        return this.http.post(this.CREATE_URL, payload);
    }
    
        private DELETE_URL = 'http://localhost:8080/api/admin/delete/author';
    deleteAuthor(authorId: number): Observable<void> {
        return this.http.delete<void>(`${this.DELETE_URL}/${authorId}`);
    }
}