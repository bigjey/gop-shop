import { Prisma, SpecPreset } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/productSpecPresets`;

export const getSpecPresets = (
  query: URLSearchParams = new URLSearchParams()
): Promise<SpecPreset[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<SpecPreset[]>(
    processFetchResponse
  );
};

export const getSpecPreset = (id: number): Promise<SpecPreset> => {
  return fetch(`${API_URL}/${id}`).then<SpecPreset>(processFetchResponse);
};

export const createSpecPreset = (
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPreset> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPreset>(processFetchResponse);
};

export const updateSpecPreset = (
  id: number,
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPreset> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPreset>(processFetchResponse);
};

export const deleteSpecPreset = (id: number): Promise<SpecPreset> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<SpecPreset>(processFetchResponse);
};
