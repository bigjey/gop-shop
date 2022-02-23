import { observer } from 'mobx-react-lite';
import React from 'react';
import { CartTable } from '../../components/CartTable';
import { ShopAppStateContext } from '../../stores';

export const CartScreen: React.FC = observer(() => {
  const state = React.useContext(ShopAppStateContext);

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title from-blog__title">
                <h2>Cart</h2>
              </div>
              {state.cartCount === 0 && (
                <>
                  <p align="center">Cart is empty</p>
                </>
              )}
              {state.cartCount > 0 && <CartTable />}
            </div>
          </div>
          {state.cartCount > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="shoping__cart__btns">
                  <a href="#" className="primary-btn cart-btn">
                    CONTINUE SHOPPING
                  </a>
                  <a href="#" className="primary-btn cart-btn cart-btn-right">
                    <span className="icon_loading"></span>
                    Upadate Cart
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="shoping__continue">
                  <div className="shoping__discount">
                    <h5>Discount Codes</h5>
                    <form action="#">
                      <input type="text" placeholder="Enter your coupon code" />
                      <button type="submit" className="site-btn">
                        APPLY COUPON
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="shoping__checkout">
                  <h5>Cart Total</h5>
                  <ul>
                    <li>
                      Subtotal <span>$454.98</span>
                    </li>
                    <li>
                      Total <span>$454.98</span>
                    </li>
                  </ul>
                  <a href="#" className="primary-btn">
                    PROCEED TO CHECKOUT
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
});
