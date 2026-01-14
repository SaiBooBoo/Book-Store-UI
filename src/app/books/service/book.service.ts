import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageResponse } from "../models/page.model";
import { Book } from "../../books/model/book.model";


@Injectable({
    providedIn: 'root'
})
export class BookService {

    private readonly API_URL = 'http://localhost:8080/api/admin/books';

    constructor(private http: HttpClient) {}

    getBooks(
        page: number = 0,
        size: number = 5,
        sortBy: string = 'id',
        direction: string = 'asc'
    ): Observable<PageResponse<Book>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sortBy', sortBy)
            .set('direction', direction);
        
        return this.http.get<PageResponse<Book>>(this.API_URL, {params});
    }

    private CREATE_URL = "http://localhost:8080/api/admin/new/book"
    createBook(payload: any) {
        return this.http.post(this.CREATE_URL, payload);
    }

    private DELETE_URL = 'http://localhost:8080/api/admin/delete/book';
    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.DELETE_URL}/${id}`);
    }
}