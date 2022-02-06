import React from 'react';
import { Product } from '@prisma/client';
import { Button, Table } from 'react-bootstrap';
import { SortOptions } from '../../../shared/types';
import { Link } from 'react-router-dom';

type ProductsTableProps = {
  items?: Product[];
  sort: SortOptions<Product>;
  onSortChange(newSortField: SortOptions<Product>): void;
  onDeleteClick(product: Product): void;
};

export const ProductsTable: React.FC<ProductsTableProps> = (props) => {
  const { items = [], onSortChange, sort, onDeleteClick } = props;

  if (!items.length) {
    return <>No items</>;
  }

  const updateSortField = (field: keyof Product) => {
    let sortOrder: 'asc' | 'desc' = 'asc';
    if (sort.sortField === field) {
      sortOrder = sort.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    onSortChange({
      sortField: field,
      sortOrder: sortOrder,
    });
  };

  return (
    <Table hover>
      <thead>
        <tr>
          <td onClick={() => updateSortField('id')}>
            id <SortDirection {...sort} field="id" />
          </td>
          <td onClick={() => updateSortField('name')}>
            name <SortDirection {...sort} field="name" />
          </td>
          <td onClick={() => updateSortField('price')}>
            price <SortDirection {...sort} field="price" />
          </td>
          <td onClick={() => updateSortField('categoryId')}>
            category <SortDirection {...sort} field="categoryId" />
          </td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ProductTableRow
            key={item.id}
            product={item}
            onDelete={onDeleteClick}
          />
        ))}
      </tbody>
    </Table>
  );
};

export const ProductTableRow: React.FC<{
  product: Product;
  onDelete(product: Product): void;
}> = (props) => {
  const { product, onDelete } = props;
  return (
    <tr>
      <td>{product.id}</td>
      <td>
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </td>
      <td>{product.price}</td>
      <td>{product.categoryId || null}</td>
      <td align="right">
        <Button size="sm" variant="danger" onClick={() => onDelete(product)}>
          delete
        </Button>
      </td>
    </tr>
  );
};

const SortDirection: React.FC<SortOptions<Product> & { field: string }> = (
  props
) => {
  const { field, sortField, sortOrder } = props;

  if (field !== sortField) {
    return null;
  }

  return sortOrder === 'asc' ? <>&darr;</> : <>&uarr;</>;
};
