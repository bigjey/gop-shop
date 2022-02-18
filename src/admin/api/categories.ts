import { Category, Prisma } from '@prisma/client';
import { DeleteOptions } from '../../shared/types';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/categories`;

export const getCategoriesTree = () => {
  return fetch(`${API_URL}/tree`).then<Category[]>(processFetchResponse);
};

export const getCategory = (id: number): Promise<Category> => {
  return fetch(`${API_URL}/${id}`).then<Category>(processFetchResponse);
};

export const updateCategory = (
  id: number,
  data: Prisma.CategoryUncheckedUpdateInput
) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};

export const createCategory = (data: Prisma.CategoryUncheckedCreateInput) => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};

export const deleteCategory = (
  id: number,
  options: DeleteOptions = { type: 'all' }
) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
    body: JSON.stringify(options),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};
