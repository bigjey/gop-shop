import { Prisma } from '@prisma/client';
import { UserAuth } from '../../shared/types';
import { processFetchResponse } from '../../shared/utils';

const API_URL = `/api/auth`;

export const register = (data: Prisma.UserUncheckedCreateInput) => {
  return fetch(`${API_URL}/register`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};

export const login = (data: { email: string; password: string }) => {
  return fetch(`${API_URL}/login`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};

export const forgotPassword = (data: { email: string }) => {
  return fetch(`${API_URL}/forgotPassword`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<{ token: string; userId: number }>(processFetchResponse);
};

export const resetPassword = (data: {
  password: string;
  repeatPassword: string;
  token: string;
  userId: number;
}) => {
  return fetch(`${API_URL}/reset`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  }).then<void>(processFetchResponse);
};

export const checkAuth = () => {
  return fetch('/api/auth').then<UserAuth | null>(processFetchResponse);
};
