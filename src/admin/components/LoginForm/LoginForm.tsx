import React from 'react';
import { UserRole } from '@prisma/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../api/auth';

type LoginFormProps = {
  role: UserRole;
};

export const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik<{ email: string; password: string }>({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      toast.promise(
        login(values).then(() => {
          const state = location.state as { url?: string };

          if (state?.url) {
            navigate(state.url);
          } else {
            navigate('/');
          }
        }),
        {
          loading: 'Processing...',
          success: <b>Success</b>,
          error: (err) => {
            return <b>{err.message || 'Failed to Log in'}</b>;
          },
        }
      );
    },
  });

  return (
    <Form
      noValidate
      onSubmit={formik.handleSubmit}
      style={{ textAlign: 'left' }}
    >
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
          size="lg"
          autoFocus
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>
      <br />
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
          size="lg"
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.password}
        </Form.Control.Feedback>
        <div className="text-center"></div>
      </Form.Group>
      <br />
      <div className="d-grid gap-2 mb-3">
        <Button variant="primary" type="submit" size="lg">
          Log In
        </Button>
        <Button
          variant="link"
          type="button"
          onClick={() => navigate('/forgotPassword')}
        >
          I forgot my password
        </Button>
        <hr />
        <div className="text-center">
          No account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </Form>
  );
};
