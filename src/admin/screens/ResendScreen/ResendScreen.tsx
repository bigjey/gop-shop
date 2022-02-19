import React from 'react';
import { Container } from 'react-bootstrap';

import { ResendForm } from '../../components/ResendForm';

export const ResendScreen = () => {
  return (
    <>
      <div className="form-screen">
        <Container>
          <h1>Forgot your password?</h1>
          <p>No worries. We can send you a reset link.</p>
          <br />
          <ResendForm />
        </Container>
      </div>
    </>
  );
};
