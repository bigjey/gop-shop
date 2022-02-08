import { Prisma, Spec } from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Form, Row, Button } from 'react-bootstrap';

type SpecFormProps = {
  data: Partial<Spec>;
  onSubmit(values: Prisma.SpecCreateInput): unknown;
};

export const SpecForm: React.FC<SpecFormProps> = (props) => {
  const { data, onSubmit } = props;

  const formik = useFormik<Prisma.SpecCreateInput>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      ...data,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: async (values) => {
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
        <br />
        <Button variant="primary" type="submit" size="lg">
          Submit
        </Button>
      </Form>
    </>
  );
};
