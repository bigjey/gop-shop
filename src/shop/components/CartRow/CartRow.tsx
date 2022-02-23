import React from 'react';
import { CartItemWithIncludes } from '../../../shared/types';
import { imageUrl } from '../../../shared/utils';
import { ShopAppStateContext } from '../../stores';

const updateCartItem = (productId: number, qty: number) => {
  return fetch('/api/cart', {
    method: 'put',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId, qty }),
  });
};

const deleteCartItem = (productId: number) => {
  return fetch('/api/cart', {
    method: 'delete',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
};

const fetchCart = (): Promise<CartItemWithIncludes[]> => {
  return fetch('/api/cart').then((r) => r.json());
};

export const CartRow: React.FC<{ data: CartItemWithIncludes }> = (props) => {
  const { data } = props;
  const [qty, setQty] = React.useState<number>(data.qty);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const state = React.useContext(ShopAppStateContext);

  const onUpdateClick = () => {
    if (qty > 0) {
      setLoading(true);
      updateCartItem(data.productId, qty)
        .then(() => fetchCart())
        .then((cart) => {
          state.setCart(cart);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert('qty? wtf is up with that?');
    }
  };

  const onDeleteClick = () => {
    setDeleting(true);
    deleteCartItem(data.productId)
      .then(() => fetchCart())
      .then((cart) => {
        state.setCart(cart);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <>
      <tr className={`shoping__cart__row ${deleting ? 'deleting' : ''}`}>
        <td className="shoping__cart__item">
          <img
            src={imageUrl(data.product.images[0].publicId, {
              resize: { width: 150, height: 150 },
            })}
            alt=""
          />
          <h5>{data.product.name}</h5>
        </td>
        <td className="shoping__cart__price">${data.product.price}</td>
        <td className="shoping__cart__quantity">
          <div className="quantity">
            <div className="pro-qty">
              <input
                type="number"
                value={qty}
                min="1"
                onChange={(e) => setQty(Number(e.target.value))}
              />
              <button
                disabled={deleting || qty === data.qty}
                className="site-btn"
                onClick={loading ? undefined : onUpdateClick}
              >
                {loading ? <span className="icon_loading"></span> : 'Update'}
              </button>
            </div>
          </div>
        </td>
        <td className="shoping__cart__total">
          ${data.product.price * data.qty}
        </td>
        <td className="shoping__cart__item__close">
          <span className="icon_close" onClick={onDeleteClick}></span>
        </td>
      </tr>
    </>
  );
};
