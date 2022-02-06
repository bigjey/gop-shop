import { Prisma, Product, ProductReview, ReviewStatus } from '@prisma/client';
import React from 'react';
import { Button, Col, Container, Nav, Row, Spinner } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AdminProductsFilter, SortOptions } from '../../../shared/types';
import { deleteProduct } from '../../api/products';
import { deleteReview, getReviews } from '../../api/reviews';
import { ProductsTable } from '../../components/ProductsTable';
import { ReviewsTable } from '../../components/ReviewsTable';

export const ProductReviewsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [reviews, setReviews] = React.useState<ProductReview[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = React.useState<
    ReviewStatus | 'all'
  >('all');
  const [reviewsSort, setReviewsSort] = React.useState<
    SortOptions<ProductReview>
  >({
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const query = new URLSearchParams();

    if (reviewStatusFilter !== 'all') {
      query.append('status', reviewStatusFilter);
    }

    reviewsSort.sortField && query.append('sortField', reviewsSort.sortField);
    reviewsSort.sortOrder && query.append('sortOrder', reviewsSort.sortOrder);

    setIsLoading(true);

    getReviews(query)
      .then((data) => {
        setReviews(data);
      })
      .catch(() => {
        alert('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.key, reviewStatusFilter, reviewsSort]);

  const onSortChange = React.useCallback(
    (newSort: SortOptions<ProductReview>) => {
      setReviewsSort(newSort);
    },
    []
  );

  const onDeleteClick = React.useCallback((review: ProductReview) => {
    if (confirm(`Delete this review?`)) {
      deleteReview(review.id)
        .then(() => {
          navigate('', { replace: true });
        })
        .catch(console.log);
    }
  }, []);

  return (
    <>
      <div className="app-content-title">
        <Container>
          <h1>Manage Product Reviews</h1>
        </Container>
      </div>
      <div className="app-content-controls">
        <Container>
          <Row>
            <Col>
              <Nav variant="pills" activeKey={reviewStatusFilter}>
                <Nav.Item style={{ alignSelf: 'center', paddingRight: 20 }}>
                  Status:
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey={'all'}
                    onClick={() => setReviewStatusFilter('all')}
                  >
                    All
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey={'new'}
                    onClick={() => setReviewStatusFilter('new')}
                  >
                    New
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey={'pending'}
                    onClick={() => setReviewStatusFilter('pending')}
                  >
                    Pending
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey={'proofed'}
                    onClick={() => setReviewStatusFilter('proofed')}
                  >
                    Proofed
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col style={{ textAlign: 'right' }}>
              <Button
                size="lg"
                onClick={() => {
                  navigate('add');
                }}
              >
                Add Review
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="app-content-body">
        <Container>
          <div className="data-loading-area">
            {isLoading && (
              <div className="data-loading-indicator">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
            {reviews.length > 0 && (
              <ReviewsTable
                items={reviews}
                sort={reviewsSort}
                onSortChange={onSortChange}
                onDeleteClick={onDeleteClick}
              />
            )}
            {!isLoading && !reviews.length && 'No items yet'}
          </div>
        </Container>
      </div>
      <Outlet />
    </>
  );
};
