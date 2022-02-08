import { Prisma, Spec, SpecPresetGroupItem } from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Form, Row, Button } from 'react-bootstrap';

type SpecPresetGroupItemFormProps = {
  groupId: number;
  specs: Spec[];
  data: Partial<SpecPresetGroupItem>;
  onSubmit(values: Prisma.SpecPresetGroupItemUncheckedCreateInput): unknown;
};

export const SpecPresetGroupItemForm: React.FC<SpecPresetGroupItemFormProps> = (
  props
) => {
  const { data, onSubmit, groupId, specs } = props;

  const formik = useFormik<Prisma.SpecPresetGroupItemUncheckedCreateInput>({
    enableReinitialize: true,
    initialValues: {
      presetGroupId: groupId,
      specId: 0,
      sortOrder: 1,
      ...data,
    },
    validationSchema: Yup.object({
      specId: Yup.number().integer().positive('Required').required(),
      sortOrder: Yup.number().integer().positive().required(),
    }),
    onSubmit: async (values) => {
      values.sortOrder = Number(values.sortOrder);
      if (values.specId) {
        values.specId = Number(values.specId);
      }
      const result = await onSubmit(values);

      console.log(result);
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="specId">
            Spec
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              id="specId"
              name="specId"
              onChange={formik.handleChange}
              value={formik.values.specId}
              required
              isInvalid={!!(formik.touched.specId && formik.errors.specId)}
            >
              <option>- Select -</option>
              {specs.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.specId}
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
