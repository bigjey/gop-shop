import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../api/auth';
import { useNavigate } from 'react-router';

export const ResendForm: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik<{ email: string }>({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
    }),
    onSubmit: async (values) => {
      toast.promise(
        forgotPassword(values).then((data) => {
          navigate(`/reset?token=${data.token}&userId=${data.userId}`);
        }),
        {
          loading: 'Processing...',
          success: <b>Email sent</b>,
          error: <b>Failed to send email</b>,
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
      <div className="d-grid gap-2 mb-3">
        <Button variant="primary" type="submit" size="lg">
          Send reset link
        </Button>
      </div>
    </Form>
  );
};
