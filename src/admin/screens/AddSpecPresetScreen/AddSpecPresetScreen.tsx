import { Prisma } from '@prisma/client';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import { createSpecPreset } from '../../api/specPresets';
import { SpecPresetForm } from '../../components/SpecPresetForm';

export const AddSpecPresetScreen: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = React.useCallback((data: Prisma.SpecPresetCreateInput) => {
    toast.promise(
      createSpecPreset(data).then((spec) => {
        navigate(`/specPresets/${spec.id}`);
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
          navigate('/specPresets');
        }}
      >
        <>
          <Modal.Header closeButton>
            <Modal.Title>New Spec Preset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecPresetForm onSubmit={onSubmit} data={{}} />
          </Modal.Body>
        </>
      </Modal>
    </>
  );
};
