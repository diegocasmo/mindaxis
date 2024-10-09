export type PaginationParams = {
  page?: number;
  perPage?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  metadata: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 50;
export const MAX_PER_PAGE = 100;

export function getPaginationParams(
  params: PaginationParams
): Required<PaginationParams> {
  return {
    page: Math.max(1, params.page ?? DEFAULT_PAGE),
    perPage: Math.min(
      MAX_PER_PAGE,
      Math.max(1, params.perPage ?? DEFAULT_PER_PAGE)
    ),
  };
}

export function calculatePaginationMetadata(
  total: number,
  { page, perPage }: Required<PaginationParams>
): PaginatedResult<unknown>["metadata"] {
  return {
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
