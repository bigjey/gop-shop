import 'bootstrap/dist/css/bootstrap.css';
import './admin.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'react-hot-toast';

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
import { AppState, AppStateContext } from './stores';
import { LoginScreen } from './screens/LoginScreen';
import { ResendScreen } from './screens/ResendScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ResetScreen } from './screens/ResetScreen';
import { AuthRequired } from './components/AuthRequired';
import { Container } from 'react-bootstrap';

const mountNode = document.getElementById('app');

const App = observer(() => {
  return (
    <React.StrictMode>
      <AppStateContext.Provider value={new AppState()}>
        <Toaster />
        <BrowserRouter basename="/admin">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgotPassword" element={<ResendScreen />} />
            <Route path="/reset" element={<ResetScreen />} />
            <Route
              path="/"
              element={
                <AuthRequired>
                  <AdminApp />
                </AuthRequired>
              }
            >
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
            </Route>
            <Route
              path="*"
              element={
                <>
                  <div className="form-screen">
                    <Container>
                      <h1>404</h1>
                      If you know what you are doing -{' '}
                      <Link to="/login">Log in</Link>
                    </Container>
                  </div>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppStateContext.Provider>
    </React.StrictMode>
  );
});

render(<App />, mountNode);
