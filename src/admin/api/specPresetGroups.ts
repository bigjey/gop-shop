import { Prisma, SpecPresetGroup } from '@prisma/client';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/productSpecPresetGroups`;

export const getSpecPresetGroups = (
  query: URLSearchParams = new URLSearchParams()
): Promise<SpecPresetGroup[]> => {
  return fetch(`${API_URL}?${query.toString()}`).then<SpecPresetGroup[]>(
    processFetchResponse
  );
};

export const getSpecPresetGroup = (id: number): Promise<SpecPresetGroup> => {
  return fetch(`${API_URL}/${id}`).then<SpecPresetGroup>(processFetchResponse);
};

export const createSpecPresetGroup = (
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPresetGroup> => {
  return fetch(`${API_URL}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPresetGroup>(processFetchResponse);
};

export const updateSpecPresetGroup = (
  id: number,
  data: Prisma.SpecPresetCreateInput
): Promise<SpecPresetGroup> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<SpecPresetGroup>(processFetchResponse);
};

export const deleteSpecPresetGroup = (id: number): Promise<SpecPresetGroup> => {
  return fetch(`${API_URL}/${id}`, {
    method: 'delete',
  }).then<SpecPresetGroup>(processFetchResponse);
};
