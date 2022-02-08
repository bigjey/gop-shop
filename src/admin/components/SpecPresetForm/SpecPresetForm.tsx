import {
  Prisma,
  Spec,
  SpecPreset,
  SpecPresetGroup,
  SpecPresetGroupItem,
} from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Col,
  Form,
  Row,
  Button,
  Table,
  Card,
  ListGroup,
  ListGroupItem,
  Modal,
} from 'react-bootstrap';
import toast from 'react-hot-toast';

import { SpecPresetWithIncludes } from '../../../shared/types';
import { Outlet, useNavigate } from 'react-router';
import { SpecPresetGroupForm } from '../SpecPresetGroupForm';
import {
  createSpecPresetGroup,
  deleteSpecPresetGroup,
  updateSpecPresetGroup,
} from '../../api/specPresetGroups';
import {
  createSpecPresetGroupItem,
  deleteSpecPresetGroupItem,
  updateSpecPresetGroupItem,
} from '../../api/specPresetGroupItems';
import { SpecPresetGroupItemForm } from '../SpecPresetGroupItemForm';
import { getSpecs } from '../../api/specs';

type SpecPresetFormProps = {
  editing: boolean;
  data: Partial<SpecPresetWithIncludes>;
  onSubmit(values: Prisma.SpecPresetCreateInput): unknown;
};

export const SpecPresetForm: React.FC<SpecPresetFormProps> = (props) => {
  const { data, onSubmit, editing = false } = props;

  const [specs, setSpecs] = React.useState<Spec[]>();

  const [modal, setModal] = React.useState<
    | { type: 'addGroup' }
    | { type: 'editGroup'; group: SpecPresetGroup }
    | { type: 'addItem'; groupId: number }
    | { type: 'editItem'; item: SpecPresetGroupItem }
  >();

  const navigate = useNavigate();

  React.useEffect(() => {
    getSpecs()
      .then((data) => setSpecs(data))
      .catch(() => alert('error'));
  }, []);

  const formik = useFormik<Prisma.SpecPresetCreateInput>({
    enableReinitialize: true,
    initialValues: {
      name: data.name || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      const result = await onSubmit(values);

      console.log(result);
    },
  });

  const usedSpecs = React.useMemo(() => {
    const ids = new Set();
    for (const group of data.presetGroups || []) {
      for (const item of group.presetGroupItems || []) {
        ids.add(item.specId);
      }
    }
    return ids;
  }, [data]);

  const onGroupCreate = React.useCallback((values) => {
    toast.promise(
      createSpecPresetGroup(values).then(() => {
        setModal(undefined);
        navigate('', { replace: true });
      }),
      {
        loading: 'Adding group...',
        success: <b>Group added!</b>,
        error: <b>Not added.</b>,
      }
    );
  }, []);

  const onGroupUpdate = React.useCallback((values) => {
    toast.promise(
      updateSpecPresetGroup(values.id, values).then(() => {
        setModal(undefined);
        navigate('', { replace: true });
      }),
      {
        loading: 'Updating group...',
        success: <b>Group updated!</b>,
        error: <b>Not updated.</b>,
      }
    );
  }, []);

  const onGroupDelete = (group: SpecPresetGroup) => {
    if (confirm(`Delete group ${group.name}?`)) {
      toast.promise(
        deleteSpecPresetGroup(group.id).then(() => {
          navigate('', { replace: true });
        }),
        {
          loading: 'Deleting group...',
          success: <b>Group deleted!</b>,
          error: <b>Not deleted.</b>,
        }
      );
    }
  };

  const onItemCreate = React.useCallback((values) => {
    toast.promise(
      createSpecPresetGroupItem(values).then(() => {
        setModal(undefined);
        navigate('', { replace: true });
      }),
      {
        loading: 'Adding spec...',
        success: <b>Spec added!</b>,
        error: <b>Not added.</b>,
      }
    );
  }, []);

  const onItemUpdate = React.useCallback((values) => {
    toast.promise(
      updateSpecPresetGroupItem(values.id, values).then(() => {
        setModal(undefined);
        navigate('', { replace: true });
      }),
      {
        loading: 'Updating spec...',
        success: <b>Spec updated!</b>,
        error: <b>Not updated.</b>,
      }
    );
  }, []);

  const onItemDelete = (item: SpecPresetGroupItem & { spec?: Spec }) => {
    if (confirm(`Delete spec ${item.spec?.name}?`)) {
      toast.promise(
        deleteSpecPresetGroupItem(item.id).then(() => {
          navigate('', { replace: true });
        }),
        {
          loading: 'Deleting spec...',
          success: <b>Spec deleted!</b>,
          error: <b>Not deleted.</b>,
        }
      );
    }
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="name">
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size="lg"
              type="text"
              placeholder=""
              required
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.name && formik.errors.name)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" size="lg">
          Submit
        </Button>
        <br />
        <br />

        {editing && (
          <>
            <h3>Groups and Specs</h3>
            <hr />
            {data.presetGroups?.map((group) => (
              <React.Fragment key={group.id}>
                <Card style={{ width: '30rem' }}>
                  <Card.Header>
                    <div
                      className="spec-preset-group-header"
                      style={{ display: 'flex' }}
                    >
                      <Card.Title>{group.name}</Card.Title>
                      <div style={{ flex: '1 0 auto', textAlign: 'right' }}>
                        <div className="spec-preset-group-header__controls">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              setModal({ type: 'editGroup', group })
                            }
                          >
                            edit
                          </Button>{' '}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => onGroupDelete(group)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    {group.presetGroupItems?.map((item) => (
                      <React.Fragment key={item.id}>
                        <ListGroupItem>
                          <div
                            className="spec-preset-group-header"
                            style={{ display: 'flex' }}
                          >
                            <div>{item.spec?.name}</div>
                            <div
                              style={{ flex: '1 0 auto', textAlign: 'right' }}
                            >
                              <div className="spec-preset-group-header__controls">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() =>
                                    setModal({ type: 'editItem', item })
                                  }
                                >
                                  edit
                                </Button>{' '}
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => onItemDelete(item)}
                                >
                                  X
                                </Button>
                              </div>
                            </div>
                          </div>
                        </ListGroupItem>
                      </React.Fragment>
                    ))}
                    <ListGroupItem>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          setModal({ type: 'addItem', groupId: group.id })
                        }
                      >
                        + Spec
                      </Button>
                    </ListGroupItem>
                  </ListGroup>
                </Card>
                <br />
              </React.Fragment>
            ))}
            <Button size="sm" onClick={() => setModal({ type: 'addGroup' })}>
              + Group
            </Button>
          </>
        )}
      </Form>
      {modal?.type === 'addGroup' && (
        <Modal
          show
          centered
          size="lg"
          onHide={() => {
            setModal(undefined);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecPresetGroupForm
              presetId={Number(data.id)}
              onSubmit={onGroupCreate}
              data={{}}
            />
          </Modal.Body>
        </Modal>
      )}
      {modal?.type === 'editGroup' && (
        <Modal
          show
          centered
          size="lg"
          onHide={() => {
            setModal(undefined);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecPresetGroupForm
              presetId={Number(data.id)}
              onSubmit={onGroupUpdate}
              data={{
                id: modal.group.id,
                name: modal.group.name,
                sortOrder: modal.group.sortOrder,
              }}
            />
          </Modal.Body>
        </Modal>
      )}
      {modal?.type === 'addItem' && specs && (
        <Modal
          show
          centered
          size="lg"
          onHide={() => {
            setModal(undefined);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Spec</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecPresetGroupItemForm
              groupId={modal.groupId}
              onSubmit={onItemCreate}
              data={{}}
              specs={specs.filter((s) => !usedSpecs.has(s.id))}
            />
          </Modal.Body>
        </Modal>
      )}
      {modal?.type === 'editItem' && specs && (
        <Modal
          show
          centered
          size="lg"
          onHide={() => {
            setModal(undefined);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Spec</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SpecPresetGroupItemForm
              groupId={modal.item.presetGroupId}
              onSubmit={onItemUpdate}
              data={{
                id: modal.item.id,
                specId: modal.item.specId,
                sortOrder: modal.item.sortOrder,
              }}
              specs={specs.filter(
                (s) => !usedSpecs.has(s.id) || s.id === modal.item.specId
              )}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
