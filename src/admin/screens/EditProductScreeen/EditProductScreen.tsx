import { Prisma, Product } from '@prisma/client';
import React from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Row,
  Spinner,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProductWithIncludes } from '../../../shared/types';
import { imageUrl } from '../../../shared/utils';
import { updateProduct, getProduct } from '../../api/products';
import { ProductForm } from '../../components/ProductForm';
import { ProductGalleryForm } from '../../components/ProductGalleryForm/ProductGalleryForm';
import { ProductSpecsForm } from '../../components/ProductSpecsForm';

export const EditProductScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<ProductWithIncludes>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProduct = () => {
    const query = new URLSearchParams();
    query.append('includeImages', '1');
    query.append('includeSpecs', '1');

    getProduct(Number(id), query).then((data) => setProduct(data));
  };

  React.useEffect(() => {
    fetchProduct();
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

  const onChange = () => {
    fetchProduct();
  };

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
                <Tabs defaultActiveKey="general" className="mb-4">
                  <Tab eventKey="general" title="General info">
                    <ProductForm key={id} onSubmit={onSubmit} data={product} />
                  </Tab>
                  <Tab eventKey="gallery" title="Gallery">
                    <ProductGalleryForm product={product} onChange={onChange} />
                  </Tab>
                  <Tab eventKey="specs" title="Specifications">
                    <ProductSpecsForm product={product} onChange={onChange} />
                  </Tab>
                </Tabs>
              </>
            ) : null}
          </div>
        </Container>
      </div>
    </>
  );
};
