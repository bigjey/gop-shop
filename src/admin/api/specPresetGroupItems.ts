import { Prisma, SpecPresetGroupItem } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/productSpecPresetGroupItems`;

export const getSpecPresetGroupItems = (
  query: URLSearchParams = new URLSearchParams()
): Promise<SpecPresetGroupItem[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<SpecPresetGroupItem[]>(
    processFetchResponse
  );
};

export const getSpecPresetGroupItem = (
  id: number
): Promise<SpecPresetGroupItem> => {
  return fetch(`${API_URL}/${id}`).then<SpecPresetGroupItem>(
    processFetchResponse
  );
};

export const createSpecPresetGroupItem = (
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPresetGroupItem> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPresetGroupItem>(processFetchResponse);
};

export const updateSpecPresetGroupItem = (
  id: number,
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPresetGroupItem> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPresetGroupItem>(processFetchResponse);
};

export const deleteSpecPresetGroupItem = (
  id: number
): Promise<SpecPresetGroupItem> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<SpecPresetGroupItem>(processFetchResponse);
};
