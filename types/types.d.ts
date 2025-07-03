export interface Paginated<T> {
  success: boolean;
  data: T;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
