import { Product } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/products`;

export const getProducts = (query: URLSearchParams): Promise<Product[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<Product[]>(
    processFetchResponse
  );
};
