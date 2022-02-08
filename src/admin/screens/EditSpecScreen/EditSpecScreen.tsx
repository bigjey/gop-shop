import { Prisma, Spec } from '@prisma/client';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';

import { SpecForm } from '../../components/SpecForm';
import { getSpec, updateSpec } from '../../api/specs';

export const EditSpecScreen: React.FC = () => {
  const [spec, setSpec] = React.useState<Spec>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getSpec(Number(id)).then((data) => setSpec(data));
  }, [id, location.key]);

  const onSubmit = React.useCallback((data: Prisma.SpecCreateInput) => {
    toast.promise(
      updateSpec(Number(id), data).then(() => {
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
            <Modal.Title>Edit Product Spec</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {spec ? <SpecForm onSubmit={onSubmit} data={spec} /> : null}
          </Modal.Body>
        </>
      </Modal>
    </>
  );
};
