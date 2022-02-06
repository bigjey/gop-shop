import { Prisma, ProductReview } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/productReviews`;

export const getReviews = (
  query: URLSearchParams
): Promise<ProductReview[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<ProductReview[]>(
    processFetchResponse
  );
};

export const getReview = (id: number): Promise<ProductReview> => {
  return fetch(`${API_URL}/${id}`).then<ProductReview>(processFetchResponse);
};

export const createReview = (
  data: Prisma.ProductReviewUncheckedCreateInput
): Promise<ProductReview> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<ProductReview>(processFetchResponse);
};

export const updateReview = (
  id: number,
  data: Prisma.ProductReviewUncheckedCreateInput
): Promise<ProductReview> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<ProductReview>(processFetchResponse);
};

export const deleteReview = (id: number): Promise<ProductReview> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<ProductReview>(processFetchResponse);
};
