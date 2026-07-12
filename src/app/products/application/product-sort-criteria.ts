export type ProductSortField = 'RELEVANCE' | 'PRICE';

export type SortDirection = 'asc' | 'desc';

export interface ProductSortCriteria {
  field: ProductSortField;
  direction: SortDirection;
}

export const DEFAULT_PRODUCT_SORT: ProductSortCriteria = {
  field: 'RELEVANCE',
  direction: 'desc',
};
