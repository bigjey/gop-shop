import { CartItem, Product, ProductImage } from '@prisma/client';
import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';

import { ShopAppStateContext } from '../../stores';

const addToCart = (productId: number, qty: number) => {
  return fetch('/api/cart', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId, qty }),
  });
};

const fetchCart = (): Promise<CartItem[]> => {
  return fetch('/api/cart').then((r) => r.json());
};

export const ProductPreviewCard: React.FC<{
  product: Product & { images?: ProductImage[] };
}> = (props) => {
  const { product } = props;

  const [qty, setQty] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const state = React.useContext(ShopAppStateContext);

  const onAddToCartClick = async () => {
    setLoading(true);
    try {
      await addToCart(product.id, qty);
      const cart = await fetchCart();
      state.setCart(cart);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="product__item">
          <div
            className="product__item__pic set-bg"
            style={{
              backgroundImage:
                product.images && product.images.length > 0
                  ? `url(${new CloudinaryImage(product.images[0].publicId, {
                      cloudName: 'hewlpuky3',
                    }).toURL()})`
                  : undefined,
            }}
          ></div>

          <div className="product__item__text">
            <h6>
              <a href="#">{product.name}</a>
            </h6>
            <h5>${product.price}</h5>
            <div className="featured__add-to-cart">
              <input
                type="number"
                name=""
                id=""
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
              <button
                type="submit"
                className="site-btn"
                onClick={onAddToCartClick}
                disabled={loading}
              >
                <i className="fa fa-shopping-cart"></i>{' '}
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
