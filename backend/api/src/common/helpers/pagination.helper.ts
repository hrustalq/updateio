import {
  PaginatedResponse,
  PaginationMetadata,
} from '../interfaces/pagination.interface';
import { SortOption } from '../interfaces/sorting.interface';

export class PaginationHelper {
  static paginate<T>(
    data: T[],
    options: {
      page: number;
      limit: number;
      total?: number;
      sort?: SortOption<T>[];
    },
  ): Partial<PaginatedResponse<T>> {
    const { page, limit, sort } = options;
    const total = options.total ?? data.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    // Apply sorting if provided
    const sortedData = sort ? this.applySorting(data, sort) : data;
    const paginatedData = options.total
      ? sortedData
      : sortedData.slice(start, end);

    return {
      data: paginatedData,
      metadata: {
        pagination: {
          total,
          page: currentPage,
          limit,
          totalPages,
          hasPreviousPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
        },
        sorting: sort ? { sortBy: sort } : undefined,
      },
    };
  }

  private static applySorting<T>(data: T[], sort: SortOption<T>[]): T[] {
    return [...data].sort((a, b) => {
      for (const { field, order } of sort) {
        if (a[field] === b[field]) continue;

        const comparison = this.compare(a[field], b[field]);
        return order === 'ASC' ? comparison : -comparison;
      }
      return 0;
    });
  }

  private static compare(a: any, b: any): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    return a < b ? -1 : a > b ? 1 : 0;
  }

  static getPaginationInfo(options: {
    page: number;
    limit: number;
    total: number;
  }): PaginationMetadata {
    const { page, limit, total } = options;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages));

    return {
      total,
      page: currentPage,
      limit,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }

  static getPageOffsets(
    page: number,
    limit: number,
  ): { start: number; end: number } {
    const start = (page - 1) * limit;
    const end = start + limit;
    return { start, end };
  }
}
