import { Prisma, SpecPreset } from '@prisma/client';
import React from 'react';
import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';

import { SpecPresetForm } from '../../components/SpecPresetForm';

import { getSpecPreset, updateSpecPreset } from '../../api/specPresets';

export const EditSpecPresetScreen: React.FC = () => {
  const [preset, setPreset] = React.useState<SpecPreset>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getSpecPreset(Number(id)).then((data) => setPreset(data));
  }, [id, location.key]);

  const onSubmit = React.useCallback((data: Prisma.SpecPresetCreateInput) => {
    toast.promise(
      updateSpecPreset(Number(id), data).then(() => {
        navigate(``, { replace: true });
      }),
      {
        loading: 'Updating...',
        success: <b>Updated!</b>,
        error: <b>Not updated.</b>,
      }
    );
  }, []);

  return (
    <>
      <div className="app-content-title">
        <Container>
          <h1>Edit Spec Presets</h1>
        </Container>
      </div>

      <div className="app-content-body">
        <Container>
          {preset ? (
            <SpecPresetForm onSubmit={onSubmit} data={preset} editing />
          ) : (
            <Spinner animation="border" />
          )}
        </Container>
      </div>
    </>
  );
};
