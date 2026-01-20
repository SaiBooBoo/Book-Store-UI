export const API_ENDPOINTS = {
    // api/admin/author/delete/{id}
    ADMIN: {
        AUTHORS: {
            BASE: "/admin/authors",
            CREATE: "/admin/authors",
            DELETE: (id:number) => `/admin/author/delete/${id}`
        },
        BOOKS: {
            BASE: '/admin/books',
            CREATE: '/admin/books',
            DELETE: (id:number) => `/admin/book/${id}`
        }
    }
};