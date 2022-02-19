import React from 'react';
import { UserRole } from '@prisma/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { register } from '../../api/auth';

export const RegisterForm: React.FC<{ role: UserRole }> = (props) => {
  const navigate = useNavigate();

  const formik = useFormik<{
    email: string;
    password: string;
    repeatPassword: string;
    name: string;
    role: UserRole;
  }>({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      name: '',
      role: props.role,
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
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
      toast.promise(
        register(values).then(() => {
          navigate('/login');
        }),
        {
          loading: 'Creating an account...',
          success: <b>Created, you can login now</b>,
          error: <b>Failed to create an account</b>,
        }
      );
    },
  });

  return (
    <Form
      noValidate
      onSubmit={formik.handleSubmit}
      style={{ textAlign: 'left' }}
      className="d-grid gap-2"
    >
      <Form.Group>
        <Form.Label htmlFor="name">Name (optional)</Form.Label>
        <Form.Control
          type="text"
          placeholder=""
          required
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.name && formik.errors.name)}
          autoFocus
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.name}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder=""
          required
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.email && formik.errors.email)}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>
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
        <hr />
        <div className="text-center">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </Form>
  );
};
