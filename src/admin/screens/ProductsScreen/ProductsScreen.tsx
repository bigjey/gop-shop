import { Product } from '@prisma/client';
import React from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { AdminProductsFilter, SortOptions } from '../../../shared/types';
import { deleteProduct, getProducts } from '../../api/products';
import { ProductsTable } from '../../components/ProductsTable';

export const ProductsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productsFilter, setProductsFilter] =
    React.useState<AdminProductsFilter>({});
  const [productsSort, setProductsSort] = React.useState<SortOptions<Product>>({
    sortField: 'id',
    sortOrder: 'asc',
  });

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const query = new URLSearchParams();

    productsSort.sortField && query.append('sortField', productsSort.sortField);
    productsSort.sortOrder && query.append('sortOrder', productsSort.sortOrder);

    setIsLoading(true);

    getProducts(query)
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        alert('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.key, productsFilter, productsSort]);

  const onSortChange = React.useCallback((newSort: SortOptions<Product>) => {
    setProductsSort(newSort);
  }, []);

  const onDeleteClick = React.useCallback((product: Product) => {
    if (confirm(`Delete ${product.name}?`)) {
      deleteProduct(product.id)
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
          <h1>Manage Products</h1>
        </Container>
      </div>
      <div className="app-content-controls">
        <Container>
          <Row>
            <Col style={{ flexGrow: 0 }}></Col>
            <Col style={{ textAlign: 'right' }}>
              <Button
                size="lg"
                onClick={() => {
                  navigate('/products/add');
                }}
              >
                Add Product
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
            {products.length > 0 && (
              <ProductsTable
                items={products}
                sort={productsSort}
                onSortChange={onSortChange}
                onDeleteClick={onDeleteClick}
              />
            )}
            {!isLoading && !products.length && 'No items yet'}
          </div>
        </Container>
      </div>
    </>
  );
};
