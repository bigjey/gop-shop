import "bootstrap/dist/css/bootstrap.css";
import "./admin.css";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { AdminApp } from "./components/AdminApp";
import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import { CategoriesScreen } from "./screens/CategoriesScreen";
import { CategoryForm } from "./components/CategoryForm";

const mountNode = document.getElementById("app");

const App = () => {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<AdminApp />}>
          <Route path="" element={<HomeScreen />} />
          <Route path="categories" element={<CategoriesScreen />}>
            <Route path="add" element={<CategoryForm mode="create" />} />
            <Route path="edit/:id" element={<CategoryForm mode="edit" />} />
          </Route>
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
