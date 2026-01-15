export interface DataTableInput<T> {

  pageIndex: number;

  pageSize: number;

  sortField: string | null;

  sortOrder: string | null;

  queryCriteria?: T;

  searchValue?: string | null;

}





export interface DataTableOutput<T> {

  draw: number;

  recordsTotal: number;

  recordsFiltered: number;

  data: T[];

  error: string;

} 