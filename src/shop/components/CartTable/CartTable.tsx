import { observer } from 'mobx-react-lite';
import React from 'react';
import { ShopAppStateContext } from '../../stores';
import { CartRow } from '../CartRow';

export const CartTable: React.FC = observer(() => {
  const state = React.useContext(ShopAppStateContext);
  return (
    <>
      <div className="shoping__cart__table">
        <table>
          <thead>
            <tr>
              <th className="shoping__product">Products</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.cart.map((item) => (
              <CartRow key={item.id} data={item} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
