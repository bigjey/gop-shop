import './AdminApp.css';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const AdminApp: React.FC = () => {
  return (
    <>
      <React.StrictMode>
        <Toaster />
        <div className="app-sidebar">
          <nav className="app-header">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/reviews">Product Reviews</NavLink>
            <NavLink to="/specs">Product Specs</NavLink>
            <NavLink to="/specPresets">Spec Presets</NavLink>
          </nav>
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </React.StrictMode>
    </>
  );
};
