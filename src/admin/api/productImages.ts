import { ProductImage } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/products/{id}/gallery`;

export const deleteProductImage = (
  id: number,
  imageId: number
): Promise<ProductImage> => {
  return fetch(API_URL.replace('{id}', String(id)) + '/' + imageId, {
    method: 'delete',
  }).then(processFetchResponse);
};
