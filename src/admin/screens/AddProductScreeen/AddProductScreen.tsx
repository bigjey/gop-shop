import { Prisma } from '@prisma/client';
import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { createProduct } from '../../api/products';
import { ProductForm } from '../../components/ProductForm';

export const AddProductScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = React.useCallback(
    (values: Prisma.ProductUncheckedCreateInput) => {
      setIsLoading(true);
      createProduct(values)
        .then((data) => {
          console.log({ data });
          navigate(`/products/${data.id}`);
        })
        .catch((err) => {
          console.log({ err });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    []
  );

  return (
    <>
      <div className="app-content-title">
        <Container>
          <h1>New Product</h1>
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
            <ProductForm onSubmit={onSubmit} data={{}} />
          </div>
        </Container>
      </div>
    </>
  );
};
