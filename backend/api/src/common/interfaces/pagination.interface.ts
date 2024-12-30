import { SortingMetadata } from './sorting.interface';

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    pagination?: PaginationMetadata;
    sorting?: SortingMetadata<T>;
  };
}
