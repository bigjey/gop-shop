import React from 'react';
import { UserRole } from '@prisma/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';

import { resetPassword } from '../../api/auth';

export const ResetForm: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const userId = query.get('userId');

  const formik = useFormik<{
    password: string;
    repeatPassword: string;
  }>({
    enableReinitialize: true,
    initialValues: {
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(8).required(),
      repeatPassword: Yup.string().test(
        'repeatPassword',
        'Passwords must match',
        (value, context) => {
          return value === context.parent.password;
        }
      ),
    }),
    onSubmit: async (values) => {
      if (!token || !userId) return;

      toast.promise(
        resetPassword({ ...values, token, userId: Number(userId) }).then(() => {
          navigate('/login');
        }),
        {
          loading: 'Processing...',
          success: <b>Password was reset, you can login now</b>,
          error: <b>Failed to reset your password</b>,
        }
      );
    },
  });

  if (!token || !userId) {
    return <Navigate to="/login" />;
  }

  return (
    <Form
      noValidate
      onSubmit={formik.handleSubmit}
      style={{ textAlign: 'left' }}
      className="d-grid gap-2"
    >
      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          required
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.password && formik.errors.password)}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="repeatPassword">Repeat your password</Form.Label>
        <Form.Control
          type="password"
          placeholder=""
          required
          id="repeatPassword"
          name="repeatPassword"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          isInvalid={
            !!(formik.touched.repeatPassword && formik.errors.repeatPassword)
          }
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.repeatPassword}
        </Form.Control.Feedback>
      </Form.Group>
      <br />
      <div className="d-grid gap-2 mb-3">
        <Button variant="primary" type="submit" size="lg">
          Submit
        </Button>
      </div>
    </Form>
  );
};
