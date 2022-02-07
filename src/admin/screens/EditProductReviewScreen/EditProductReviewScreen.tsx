import { Prisma, ProductReview } from '@prisma/client';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';

import { updateReview, getReview } from '../../api/reviews';
import { ReviewForm } from '../../components/ReviewForm';

export const EditProductReviewScreen: React.FC = () => {
  const [review, setReview] = React.useState<ProductReview>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getReview(Number(id)).then((data) => setReview(data));
  }, [id, location.key]);

  const onSubmit = React.useCallback(
    (data: Prisma.ProductReviewUncheckedCreateInput) => {
      toast.promise(
        updateReview(Number(id), data).then(() => {
          navigate('', { replace: true });
          return Promise.resolve();
        }),
        {
          loading: 'Saving...',
          success: <b>Saved!</b>,
          error: <b>Not saved.</b>,
        }
      );
    },
    []
  );

  return (
    <>
      <Modal
        show
        centered
        size="lg"
        onHide={() => {
          navigate('/reviews');
        }}
      >
        <>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {review && <ReviewForm onSubmit={onSubmit} data={review} />}
          </Modal.Body>
        </>
      </Modal>
    </>
  );
};
