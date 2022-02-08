import 'bootstrap/dist/css/bootstrap.css';
import './admin.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { AdminApp } from './components/AdminApp';
import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { CategoryForm } from './components/CategoryForm';
import { ProductsScreen } from './screens/ProductsScreen';
import { AddProductScreen } from './screens/AddProductScreeen';
import { EditProductScreen } from './screens/EditProductScreeen';
import { ProductReviewsScreen } from './screens/ProductReviewsScreen';
import { AddProductReviewScreen } from './screens/AddProductReviewScreen';
import { EditProductReviewScreen } from './screens/EditProductReviewScreen';
import { SpecsScreen } from './screens/SpecsScreen';
import { EditSpecScreen } from './screens/EditSpecScreen';
import { SpecPresetsScreen } from './screens/SpecPresetsScreen';
import { AddSpecScreen } from './screens/AddSpecScreen';
import { AddSpecPresetScreen } from './screens/AddSpecPresetScreen';
import { EditSpecPresetScreen } from './screens/EditSpecPresetScreen';

const mountNode = document.getElementById('app');

const App = () => {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminApp />}>
          <Route path="" element={<HomeScreen />} />
          <Route path="categories" element={<CategoriesScreen />}>
            <Route path="add" element={<CategoryForm mode="create" />} />
            <Route path=":id" element={<CategoryForm mode="edit" />} />
          </Route>
          <Route path="products/add" element={<AddProductScreen />} />
          <Route path="products/:id" element={<EditProductScreen />} />
          <Route path="products" element={<ProductsScreen />}></Route>
          <Route path="reviews" element={<ProductReviewsScreen />}>
            <Route path="add" element={<AddProductReviewScreen />} />
            <Route path=":id" element={<EditProductReviewScreen />} />
          </Route>
          <Route path="specs" element={<SpecsScreen />}>
            <Route path="add" element={<AddSpecScreen />} />
            <Route path=":id" element={<EditSpecScreen />} />
          </Route>
          <Route path="specPresets" element={<SpecPresetsScreen />}>
            <Route path="add" element={<AddSpecPresetScreen />} />
          </Route>
          <Route
            path="specPresets/:id"
            element={<EditSpecPresetScreen />}
          ></Route>
          <Route
            path="*"
            element={
              <>
                <h1>404</h1>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

render(<App />, mountNode);
