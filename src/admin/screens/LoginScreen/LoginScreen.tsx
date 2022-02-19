import React from 'react';
import { Container } from 'react-bootstrap';

import { LoginForm } from '../../components/LoginForm';

export const LoginScreen = () => {
  return (
    <>
      <div className="form-screen">
        <Container>
          <h1>Login</h1>
          <br />
          <LoginForm role="Admin" />
        </Container>
      </div>
    </>
  );
};
