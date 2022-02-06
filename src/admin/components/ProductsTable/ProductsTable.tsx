import React from 'react';
import { Product } from '@prisma/client';
import { Table } from 'react-bootstrap';
import { SortOptions } from '../../../shared/types';

type ProductsTableProps = {
  items?: Product[];
  sort: SortOptions<Product>;
  onSortChange(newSortField: SortOptions<Product>): void;
};

export const ProductsTable: React.FC<ProductsTableProps> = (props) => {
  const { items = [], onSortChange, sort } = props;

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
    <Table>
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
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ProductTableRow key={item.id} {...item} />
        ))}
      </tbody>
    </Table>
  );
};

export const ProductTableRow: React.FC<Product> = (props) => {
  const { id, name, price, categoryId } = props;
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{price}</td>
      <td>{categoryId || null}</td>
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
