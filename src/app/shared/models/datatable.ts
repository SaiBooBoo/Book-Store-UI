export interface DataTableInput<T = any> {

  pageIndex: number;

  pageSize: number;

  sortField?: string | null;

  sortOrder?: string | null;

  queryCriteria?: T;

  searchValue?: string | null;

  draw?: number | null;

}

export interface DataTableOutput<T> {

  draw: number;

  recordsTotal: number;

  recordsFiltered: number;

  data: T[];

  error?: string;

} 