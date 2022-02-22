import { observer } from 'mobx-react-lite';
import React from 'react';
import { ShopAppStateContext } from '../../stores';

export const CartCount: React.FC = observer(() => {
  const state = React.useContext(ShopAppStateContext);

  return <>{state.cartCount > 0 ? <span>{state.cartCount}</span> : null}</>;
});
