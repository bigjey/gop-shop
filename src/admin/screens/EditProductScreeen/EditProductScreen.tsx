import { Prisma, Product } from '@prisma/client';
import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateProduct, getProduct } from '../../api/products';
import { ProductForm } from '../../components/ProductForm';

export const EditProductScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<Product>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getProduct(Number(id)).then((data) => setProduct(data));
  }, [id, location.key]);

  const onSubmit = React.useCallback(
    (values: Prisma.ProductUncheckedCreateInput) => {
      setIsLoading(true);
      updateProduct(Number(id), values)
        .then((data) => {
          console.log({ data });
          navigate('', { replace: true });
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
          <h1>Edit Product {product?.id}</h1>
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
            {!isLoading && product ? (
              <>
                <ProductForm key={id} onSubmit={onSubmit} data={product} />
                <form
                  encType="multipart/form-data"
                  action={`/api/products/${id}/gallery`}
                  method="post"
                >
                  <br />
                  <input type="file" name="images" multiple />
                  <button>Upload</button>
                </form>
              </>
            ) : null}
          </div>
        </Container>
      </div>
    </>
  );
};
