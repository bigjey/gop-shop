import './AdminApp.css';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { AppStateContext } from '../stores';
import { Dropdown } from 'react-bootstrap';

const UserWidget = observer(() => {
  const state = useContext(AppStateContext);

  if (!state.auth) {
    return null;
  }

  return (
    <>
      <div className="user-widget">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-custom-components" variant="link">
            {state.auth.name}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              eventKey="logout"
              onClick={() => {
                state.setAuth(null);
              }}
            >
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
});

export const AdminApp: React.FC = () => {
  return (
    <>
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
        <UserWidget />
        <Outlet />
      </div>
    </>
  );
};
