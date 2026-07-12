import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRODUCT_SORT,
  ProductSortCriteria,
  ProductSortField,
  SortDirection,
} from './product-sort-criteria';

describe('product-sort-criteria', () => {
  it('defines RELEVANCE and PRICE as supported product sort fields', () => {
    const fields: ProductSortField[] = ['RELEVANCE', 'PRICE'];

    expect(fields).toEqual(['RELEVANCE', 'PRICE']);
  });

  it('defines asc and desc as supported sort directions', () => {
    const directions: SortDirection[] = ['asc', 'desc'];

    expect(directions).toEqual(['asc', 'desc']);
  });

  it('uses RELEVANCE desc as the default sort criteria', () => {
    const expected: ProductSortCriteria = { field: 'RELEVANCE', direction: 'desc' };

    expect(DEFAULT_PRODUCT_SORT).toEqual(expected);
  });
});
