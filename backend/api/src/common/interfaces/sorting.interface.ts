export type SortOrder = 'ASC' | 'DESC';

export interface SortOption<T> {
  field: keyof T;
  order: SortOrder;
}

export interface SortingMetadata<T> {
  sortBy: SortOption<T>[];
}
