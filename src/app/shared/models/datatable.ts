export interface DataTableInput<T = any> {

  pageIndex: number;

  pageSize: number;

  sortField?: string | null;

  sortOrder?: 'ascend' | 'descend';

  queryCriteria?: T;

  searchValue?: string | null;

  draw?: number;

}

export interface DataTableOutput<T> {

  draw: number;

  recordsTotal: number;

  recordsFiltered: number;

  data: T[];

  error?: string;

} 

export interface AuthorQueryCriteria {
  blurry?: string;
  createdDate?: [string, string];
}