import { DEFAULT_LIMIT } from '../constants/pagination';

export function calculatePagination(limit?: number, page?: number) {
  const take = !limit || limit < 0 ? DEFAULT_LIMIT : limit;
  const skip = take * ((page || 1) - 1);

  return { take, skip };
}
