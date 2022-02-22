import { CartItem, UserRole } from '../../../node_modules/.prisma/client';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

import { UserAuth } from '../../shared/types';

export class ShopAppState {
  auth?: UserAuth | null = null;

  cart: CartItem[] = [];

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

  setCart(cart: CartItem[]) {
    this.cart = cart;
  }

  get cartCount() {
    let count = 0;

    for (const item of this.cart) {
      count += item.qty;
    }

    return count;
  }
}

export const ShopAppStateContext = createContext<ShopAppState>(
  new ShopAppState()
);
