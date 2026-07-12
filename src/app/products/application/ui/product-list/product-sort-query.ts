import {
  DEFAULT_PRODUCT_SORT,
  ProductSortCriteria,
  SortDirection,
} from '../../product-sort-criteria';

type SortByQueryValue = 'relevance' | 'price';

type SortQueryParams = {
  sortBy?: string | null;
  order?: string | null;
};

export interface ProductSortOption {
  readonly id: 'relevance:desc' | 'relevance:asc' | 'price:asc' | 'price:desc';
  readonly label: 'RELEVANCE ↓' | 'RELEVANCE ↑' | 'PRICE ↑' | 'PRICE ↓';
  readonly criteria: ProductSortCriteria;
}

export const PRODUCT_SORT_OPTIONS: readonly ProductSortOption[] = [
  {
    id: 'relevance:desc',
    label: 'RELEVANCE ↓',
    criteria: { field: 'RELEVANCE', direction: 'desc' },
  },
  {
    id: 'relevance:asc',
    label: 'RELEVANCE ↑',
    criteria: { field: 'RELEVANCE', direction: 'asc' },
  },
  {
    id: 'price:asc',
    label: 'PRICE ↑',
    criteria: { field: 'PRICE', direction: 'asc' },
  },
  {
    id: 'price:desc',
    label: 'PRICE ↓',
    criteria: { field: 'PRICE', direction: 'desc' },
  },
];

const isSortDirection = (value: string | null | undefined): value is SortDirection =>
  value === 'asc' || value === 'desc';

const toSortField = (sortBy: string | null | undefined): ProductSortCriteria['field'] | undefined => {
  if (sortBy === 'relevance') {
    return 'RELEVANCE';
  }

  if (sortBy === 'price') {
    return 'PRICE';
  }

  return undefined;
};

const toQuerySortBy = (field: ProductSortCriteria['field']): SortByQueryValue =>
  field === 'RELEVANCE' ? 'relevance' : 'price';

export const normalizeProductSortQuery = ({
  sortBy,
  order,
}: SortQueryParams): ProductSortCriteria => {
  const field = toSortField(sortBy);
  const direction = isSortDirection(order) ? order : undefined;

  if (!field || !direction) {
    return DEFAULT_PRODUCT_SORT;
  }

  return { field, direction };
};

export const serializeProductSortQuery = (criteria: ProductSortCriteria) => ({
  sortBy: toQuerySortBy(criteria.field),
  order: criteria.direction,
});

export const productSortOptionIdFromCriteria = (criteria: ProductSortCriteria): ProductSortOption['id'] =>
  criteria.field === 'RELEVANCE'
    ? criteria.direction === 'asc'
      ? 'relevance:asc'
      : 'relevance:desc'
    : criteria.direction === 'asc'
      ? 'price:asc'
      : 'price:desc';

export const productSortCriteriaFromOptionId = (
  optionId: string,
): ProductSortCriteria | undefined => {
  const option = PRODUCT_SORT_OPTIONS.find(item => item.id === optionId);
  return option?.criteria;
};
