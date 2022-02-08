import { Spec } from '@prisma/client';
import React from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import { deleteSpec, getSpecs } from '../../api/specs';
import { SpecsTable } from '../../components/SpecsTable';

export const SpecsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [specs, setSpecs] = React.useState<Spec[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true);

    getSpecs()
      .then((data) => {
        setSpecs(data);
      })
      .catch(() => {
        alert('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.key]);

  const onDeleteClick = React.useCallback((spec: Spec) => {
    if (confirm(`Delete this spec?`)) {
      toast.promise(
        deleteSpec(spec.id).then(() => {
          navigate('', { replace: true });
          return Promise.resolve();
        }),
        {
          loading: 'Deleting...',
          success: <b>Deleted!</b>,
          error: <b>Not deleted.</b>,
        }
      );
    }
  }, []);

  return (
    <>
      <div className="app-content-title">
        <Container>
          <h1>Manage Product Specs</h1>
        </Container>
      </div>
      <div className="app-content-controls">
        <Container>
          <Row>
            <Col></Col>
            <Col style={{ textAlign: 'right' }}>
              <Button
                size="lg"
                onClick={() => {
                  navigate('add');
                }}
              >
                Add Spec
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="app-content-body">
        <Container>
          <div className="data-loading-area">
            {isLoading && (
              <div className="data-loading-indicator">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
            {specs.length > 0 && (
              <SpecsTable items={specs} onDeleteClick={onDeleteClick} />
            )}
            {!isLoading && !specs.length && 'No items yet'}
          </div>
        </Container>
      </div>
      <Outlet />
    </>
  );
};
