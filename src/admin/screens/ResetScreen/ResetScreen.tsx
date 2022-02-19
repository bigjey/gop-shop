import React from 'react';
import { Container } from 'react-bootstrap';

import { ResetForm } from '../../components/ResetForm';

export const ResetScreen = () => {
  return (
    <>
      <div className="form-screen">
        <Container>
          <h1>Reset Password</h1>
          <br />
          <ResetForm />
        </Container>
      </div>
    </>
  );
};
