import { Prisma, Spec } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/productSpecs`;

export const getSpecs = (
  query: URLSearchParams = new URLSearchParams()
): Promise<Spec[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<Spec[]>(
    processFetchResponse
  );
};

export const getSpec = (id: number): Promise<Spec> => {
  return fetch(`${API_URL}/${id}`).then<Spec>(processFetchResponse);
};

export const createSpec = (data: Prisma.SpecCreateInput): Promise<Spec> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<Spec>(processFetchResponse);
};

export const updateSpec = (
  id: number,
  data: Prisma.SpecCreateInput
): Promise<Spec> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<Spec>(processFetchResponse);
};

export const deleteSpec = (id: number): Promise<Spec> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<Spec>(processFetchResponse);
};
