import React from 'react';
import { CartItemWithIncludes } from '../../../shared/types';
import { imageUrl } from '../../../shared/utils';

export const CartRow: React.FC<{ data: CartItemWithIncludes }> = (props) => {
  const { data } = props;
  return (
    <>
      <tr>
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
              <input type="number" value={data.qty} />
            </div>
          </div>
        </td>
        <td className="shoping__cart__total">
          ${data.product.price * data.qty}
        </td>
        <td className="shoping__cart__item__close">
          <span className="icon_close"></span>
        </td>
      </tr>
    </>
  );
};
