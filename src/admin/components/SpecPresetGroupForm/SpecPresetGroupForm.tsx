import { Prisma, SpecPresetGroup } from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Form, Row, Button } from 'react-bootstrap';

type SpecPresetGroupFormProps = {
  presetId: number;
  data: Partial<SpecPresetGroup>;
  onSubmit(values: Prisma.SpecPresetGroupUncheckedCreateInput): unknown;
};

export const SpecPresetGroupForm: React.FC<SpecPresetGroupFormProps> = (
  props
) => {
  const { data, onSubmit, presetId } = props;

  const formik = useFormik<Prisma.SpecPresetGroupUncheckedCreateInput>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      sortOrder: 1,
      presetId,
      ...data,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      sortOrder: Yup.number().integer().positive().required(),
    }),
    onSubmit: async (values) => {
      values.sortOrder = Number(values.sortOrder);
      const result = await onSubmit(values);

      console.log(result);
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="name">
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
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
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="sortOrder">
            Sort Order
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder=""
              required
              id="sortOrder"
              name="sortOrder"
              value={formik.values.sortOrder}
              onChange={formik.handleChange}
              isInvalid={
                !!(formik.touched.sortOrder && formik.errors.sortOrder)
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.sortOrder}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <br />
        <Button variant="primary" type="submit" size="lg">
          Submit
        </Button>
      </Form>
    </>
  );
};
