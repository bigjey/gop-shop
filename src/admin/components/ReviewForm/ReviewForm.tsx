import { Product, Prisma } from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Form, Row, InputGroup, Button } from 'react-bootstrap';
import { CategoriesOptions } from '../CategoryOptions';
import { getCategoriesTree } from '../../api/categories';
import { getProducts } from '../../api/products';

type ReviewFormProps = {
  data: Partial<Prisma.ProductReviewUncheckedCreateInput>;
  onSubmit(values: Prisma.ProductReviewUncheckedCreateInput): unknown;
};

export const ReviewForm: React.FC<ReviewFormProps> = (props) => {
  const { data, onSubmit } = props;
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  const formik = useFormik<Prisma.ProductReviewUncheckedCreateInput>({
    enableReinitialize: true,
    initialValues: {
      text: '',
      score: 5,
      status: 'new',
      userId: 0,
      productId: 0,
      ...data,
    },
    validationSchema: Yup.object({
      text: Yup.string().required(),
      productId: Yup.number().integer().required(),
      userId: Yup.number().integer().required(),
    }),
    onSubmit: async (values) => {
      values.score = Number(values.score);
      values.productId = Number(values.productId);
      values.userId = Number(values.userId);

      const result = await onSubmit(values);

      console.log(result);
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="score">
            Score
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              id="score"
              name="score"
              onChange={formik.handleChange}
              value={formik.values.score}
              required
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="text">
            Text
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              type="text"
              placeholder=""
              id="text"
              name="text"
              value={formik.values.text || undefined}
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.text && formik.errors.text)}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.text}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="status">
            Status
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              id="status"
              name="status"
              onChange={formik.handleChange}
              value={formik.values.status}
              required
            >
              <option value={'new'}>new</option>
              <option value={'pending'}>pending</option>
              <option value={'proofed'}>proofed</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="productId">
            Product
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              id="productId"
              name="productId"
              onChange={formik.handleChange}
              value={formik.values.productId}
              required
            >
              <option value={''}>- Select -</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="userId">
            Customer
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              id="userId"
              name="userId"
              onChange={formik.handleChange}
              value={formik.values.userId}
              required
            >
              <option value={''}>- Select -</option>
              <option value={1}>User One</option>
            </Form.Select>
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
