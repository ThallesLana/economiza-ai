import { DateFilter } from '../interfaces/date-filter.interface';

export function buildDateFilter(filters: DateFilter): DateFilter {
  if (filters.startDate && filters.endDate) {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
    };
  }

  if (filters.year && filters.month) {
    const startDate = new Date(filters.year, filters.month - 1, 1);
    const endDate = new Date(filters.year, filters.month, 0);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  if (filters.year) {
    return { year: filters.year };
  }

  return {};
}
