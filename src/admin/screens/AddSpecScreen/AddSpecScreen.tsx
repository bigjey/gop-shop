import { Prisma } from '@prisma/client';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import { SpecForm } from '../../components/SpecForm';
import { createSpec } from '../../api/specs';

export const AddSpecScreen: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = React.useCallback((data: Prisma.SpecCreateInput) => {
    toast.promise(
      createSpec(data).then((spec) => {
        navigate(`/specs/${spec.id}`);
      }),
      {
        loading: 'Creating...',
        success: <b>Created!</b>,
        error: <b>Not created.</b>,
      }
    );
  }, []);

  return (
    <>
      <Modal
        show
        centered
        size="lg"
        onHide={() => {
          navigate('/specs');
        }}
      >
        <>
          <Modal.Header closeButton>
            <Modal.Title>New Product Spec</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecForm onSubmit={onSubmit} data={{}} />
          </Modal.Body>
        </>
      </Modal>
    </>
  );
};
