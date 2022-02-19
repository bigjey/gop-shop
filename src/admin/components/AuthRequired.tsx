import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { checkAuth } from '../api/auth';
import { AppStateContext } from '../stores';

export const AuthRequired = observer(({ children }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const state = useContext(AppStateContext);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    checkAuth()
      .then((auth) => {
        state.setAuth(auth);
        if (!auth) {
          navigate('/login', {
            state: {
              url: location.pathname + location.search,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Spinner animation="grow" variant="primary" className="preloader" />;
  }

  if (state.auth) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
});
