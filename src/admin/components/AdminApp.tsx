import "./AdminApp.css";

import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const AdminApp: React.FC = () => {
  return (
    <>
      <React.StrictMode>
        <div className="app-sidebar">
          <nav className="app-header">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/products">Products</NavLink>
          </nav>
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </React.StrictMode>
    </>
  );
};
