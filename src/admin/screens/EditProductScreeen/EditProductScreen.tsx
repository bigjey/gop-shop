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
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [productData, setProductData] = React.useState<ProductWithIncludes>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProduct = () => {
    setIsLoading(true);
    const query = new URLSearchParams();
    query.append('includeImages', '1');
    query.append('includeSpecs', '1');

    getProduct(Number(id), query)
      .then((data) => {
        setProductData(data.product);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchProduct();
  }, [id, location.key]);

  const onSubmit = React.useCallback(
    (values: Prisma.ProductUncheckedCreateInput) => {
      setIsLoading(true);
      updateProduct(Number(id), values)
        .then((data) => {
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
          <h1>Edit Product {productData?.id}</h1>
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
            {!isLoading && productData !== undefined ? (
              <>
                <Tabs defaultActiveKey="general" className="mb-4">
                  <Tab eventKey="general" title="General info">
                    <ProductForm
                      key={id}
                      onSubmit={onSubmit}
                      data={{
                        name: productData?.name ?? '',
                        price: productData?.price ?? 0,
                        categoryId: productData?.categoryId ?? null,
                        description: productData?.description ?? '',
                        isAvailable: productData?.isAvailable ?? true,
                        isActive: productData?.isActive ?? true,
                        isFeatured: productData?.isFeatured ?? false,
                        saleValue: productData?.saleValue ?? 0,
                        specPresetId: productData?.specPresetId ?? 0,
                      }}
                    />
                  </Tab>
                  <Tab eventKey="gallery" title="Gallery">
                    <ProductGalleryForm
                      product={productData}
                      onChange={onChange}
                    />
                  </Tab>
                  <Tab eventKey="specs" title="Specifications">
                    <ProductSpecsForm
                      productData={productData}
                      onChange={onChange}
                    />
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
