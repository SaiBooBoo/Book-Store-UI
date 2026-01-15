export const API_ENDPOINTS = {
    ADMIN: {
        AUTHORS: {
            BASE: "/admin/authors",
            CREATE: "/admin/authors",
            DELETE: (id:number) => '/admin/authors/${id}'
        },
        BOOKS: {
            BASE: '/admin/books',
            CREATE: '/admin/books',
            DELETE: (id:number) => '/admin/books/${id}'
        }
    }
};