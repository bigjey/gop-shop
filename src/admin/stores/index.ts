import { UserRole } from '../../../node_modules/.prisma/client';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

import { UserAuth } from '../../shared/types';

export class AppState {
  auth?: UserAuth | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(auth: UserAuth | null) {
    this.auth = auth;
  }

  get isAuthenticated() {
    return this.auth !== undefined;
  }

  get isAdmin() {
    return this.auth?.role === UserRole.Admin;
  }

  get isSuperAdmin() {
    return this.auth?.role === UserRole.SuperAdmin;
  }
}

export const AppStateContext = createContext<AppState>(new AppState());
