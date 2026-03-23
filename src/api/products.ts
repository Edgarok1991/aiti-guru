import { API_BASE, parseJson } from './client';
import type { ProductSortField, ProductsListResponse, SortOrder } from '../types';

const PAGE_SIZE = 20;

export interface FetchProductsParams {
  page: number;
  sortBy: ProductSortField;
  order: SortOrder;
  search: string;
}

export async function fetchProducts({
  page,
  sortBy,
  order,
  search,
}: FetchProductsParams): Promise<ProductsListResponse> {
  const skip = (page - 1) * PAGE_SIZE;
  const limit = PAGE_SIZE;
  const q = search.trim();

  if (q.length > 0) {
    const params = new URLSearchParams({
      q,
      limit: String(limit),
      skip: String(skip),
      sortBy,
      order,
    });
    const res = await fetch(`${API_BASE}/products/search?${params.toString()}`);
    const data = await parseJson<ProductsListResponse>(res);
    if (!res.ok) {
      throw new Error('Ошибка поиска товаров');
    }
    return data;
  }

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    sortBy,
    order,
  });
  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  const data = await parseJson<ProductsListResponse>(res);
  if (!res.ok) {
    throw new Error('Не удалось загрузить товары');
  }
  return data;
}

export { PAGE_SIZE };
