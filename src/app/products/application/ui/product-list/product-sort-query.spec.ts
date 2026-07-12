import { describe, expect, it } from 'vitest';
import {
  normalizeProductSortQuery,
  serializeProductSortQuery,
} from './product-sort-query';

describe('product-sort-query', () => {
  describe('normalizeProductSortQuery', () => {
    it('returns PRICE asc for valid params', () => {
      const result = normalizeProductSortQuery({ sortBy: 'price', order: 'asc' });

      expect(result).toEqual({ field: 'PRICE', direction: 'asc' });
    });

    it('falls back to RELEVANCE desc when params are missing', () => {
      const result = normalizeProductSortQuery({});

      expect(result).toEqual({ field: 'RELEVANCE', direction: 'desc' });
    });

    it('falls back to RELEVANCE desc when params are invalid', () => {
      const result = normalizeProductSortQuery({ sortBy: 'x', order: 'y' });

      expect(result).toEqual({ field: 'RELEVANCE', direction: 'desc' });
    });
  });

  describe('serializeProductSortQuery', () => {
    it('serializes RELEVANCE desc using public query keys', () => {
      const result = serializeProductSortQuery({ field: 'RELEVANCE', direction: 'desc' });

      expect(result).toEqual({ sortBy: 'relevance', order: 'desc' });
    });

    it('serializes PRICE asc using public query keys', () => {
      const result = serializeProductSortQuery({ field: 'PRICE', direction: 'asc' });

      expect(result).toEqual({ sortBy: 'price', order: 'asc' });
    });
  });
});
