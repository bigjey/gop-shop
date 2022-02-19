import React from 'react';
import { Container } from 'react-bootstrap';

import { RegisterForm } from '../../components/RegisterForm';

export const RegisterScreen = () => {
  return (
    <>
      <div className="form-screen">
        <Container>
          <h1>Create an Account</h1>
          <br />
          <RegisterForm role="Admin" />
        </Container>
      </div>
    </>
  );
};
