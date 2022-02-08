import { SpecPreset } from '@prisma/client';
import React from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import { deleteSpecPreset, getSpecPresets } from '../../api/specPresets';
import { SpecPresetsTable } from '../../components/SpecPresetsTable';

export const SpecPresetsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [presets, setPresets] = React.useState<SpecPreset[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true);

    getSpecPresets()
      .then((data) => {
        setPresets(data);
      })
      .catch(() => {
        alert('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.key]);

  const onDeleteClick = React.useCallback((preset: SpecPreset) => {
    if (confirm(`Delete this preset?`)) {
      toast.promise(
        deleteSpecPreset(preset.id).then(() => {
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
          <h1>Manage Spec Presets</h1>
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
                Add Preset
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
            {presets.length > 0 && (
              <SpecPresetsTable items={presets} onDeleteClick={onDeleteClick} />
            )}
            {!isLoading && !presets.length && 'No items yet'}
          </div>
        </Container>
      </div>
      <Outlet />
    </>
  );
};
