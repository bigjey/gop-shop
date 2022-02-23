import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './shop.css';
import { ShopAppState, ShopAppStateContext } from './stores';
import { ShopApp } from './components/ShopApp';
import { CatalogueScreen } from './screens/CatalogueScreen';
import { CartScreen } from './screens/CartScreen';

const mountNode = document.getElementById('app');

window.addEventListener('load', () => {
  // document.getElementById('preloader')?.remove();

  for (const el of Array.from(
    document.querySelectorAll<HTMLElement>('[data-setbg]')
  )) {
    const bg = el.getAttribute('data-setbg');
    if (bg) {
      el.style.backgroundImage = `url(./${bg})`;
    }
  }
});

render(
  <React.StrictMode>
    <ShopAppStateContext.Provider value={new ShopAppState()}>
      <Toaster />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<ShopApp />}>
            <Route path="/" element={<CatalogueScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="*" element={<>404</>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopAppStateContext.Provider>
  </React.StrictMode>,
  mountNode
);
