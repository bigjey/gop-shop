import { Prisma } from '@prisma/client';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { createReview } from '../../api/reviews';
import { ReviewForm } from '../../components/ReviewForm';

export const AddProductReviewScreen: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = React.useCallback(
    (data: Prisma.ProductReviewUncheckedCreateInput) => {
      createReview(data)
        .then((review) => {
          navigate(`/reviews/${review.id}`);
        })
        .catch(() => alert('error'));
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
            <Modal.Title>New Product Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReviewForm onSubmit={onSubmit} data={{}} />
          </Modal.Body>
        </>
      </Modal>
    </>
  );
};
