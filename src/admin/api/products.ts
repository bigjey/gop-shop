import { Prisma, Product } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/products`;

export const getProducts = (
  query: URLSearchParams = new URLSearchParams()
): Promise<Product[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<Product[]>(
    processFetchResponse
  );
};

export const createProduct = (
  data: Prisma.ProductUncheckedCreateInput
): Promise<Product> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<Product>(processFetchResponse);
};

export const updateProduct = (
  id: number,
  data: Prisma.ProductUncheckedCreateInput
): Promise<Product> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<Product>(processFetchResponse);
};

export const getProduct = (id: number): Promise<Product> => {
  return fetch(`${API_URL}/${id}`).then<Product>(processFetchResponse);
};

export const deleteProduct = (id: number): Promise<Product> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<Product>(processFetchResponse);
};
