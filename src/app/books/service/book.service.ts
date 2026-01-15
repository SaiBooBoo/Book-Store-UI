import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "../../books/model/book.model";
import { PageResponse } from "../../shared/models/page.model";
import { environment } from "../../environments/environment";
import { API_ENDPOINTS } from "../../core/constants/api-endpoints";


@Injectable({
    providedIn: 'root'
})
export class BookService {


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
        
        return this.http.get<PageResponse<Book>>(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.BOOKS.BASE);
    }

    createBook(payload: any) {
        return this.http.post(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.BOOKS.CREATE, payload);
    }

    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(environment.apiBaseUrl + API_ENDPOINTS.ADMIN.BOOKS.DELETE);
    }
}