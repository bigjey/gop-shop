import React from 'react';
import { ProductReview } from '@prisma/client';
import { Button, Table } from 'react-bootstrap';
import { SortOptions } from '../../../shared/types';
import { Link } from 'react-router-dom';

type ReviewsTableProps = {
  items?: ProductReview[];
  sort: SortOptions<ProductReview>;
  onSortChange(newSortField: SortOptions<ProductReview>): void;
  onDeleteClick(review: ProductReview): void;
};

export const ReviewsTable: React.FC<ReviewsTableProps> = (props) => {
  const { items = [], onSortChange, sort, onDeleteClick } = props;

  if (!items.length) {
    return <>No items</>;
  }

  const updateSortField = (field: keyof ProductReview) => {
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
          <td onClick={() => updateSortField('text')}>
            text <SortDirection {...sort} field="text" />
          </td>
          <td onClick={() => updateSortField('score')}>
            score <SortDirection {...sort} field="score" />
          </td>
          <td onClick={() => updateSortField('status')}>
            status <SortDirection {...sort} field="status" />
          </td>
          <td onClick={() => updateSortField('createdAt')}>
            createdAt <SortDirection {...sort} field="createdAt" />
          </td>
          <td onClick={() => updateSortField('productId')}>
            productId <SortDirection {...sort} field="productId" />
          </td>
          <td onClick={() => updateSortField('userId')}>
            userId <SortDirection {...sort} field="userId" />
          </td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ProductTableRow
            key={item.id}
            review={item}
            onDelete={onDeleteClick}
          />
        ))}
      </tbody>
    </Table>
  );
};

export const ProductTableRow: React.FC<{
  review: ProductReview;
  onDelete(product: ProductReview): void;
}> = (props) => {
  const { review, onDelete } = props;
  return (
    <tr>
      <td>{review.id}</td>
      <td>
        <Link to={`/reviews/${review.id}`}>{review.text}</Link>
      </td>
      <td>{review.score}</td>
      <td>{review.status}</td>
      <td>{review.createdAt}</td>
      <td>{review.productId}</td>
      <td>{review.userId}</td>
      <td align="right">
        <Button size="sm" variant="danger" onClick={() => onDelete(review)}>
          delete
        </Button>
      </td>
    </tr>
  );
};

const SortDirection: React.FC<
  SortOptions<ProductReview> & { field: string }
> = (props) => {
  const { field, sortField, sortOrder } = props;

  if (field !== sortField) {
    return null;
  }

  return sortOrder === 'asc' ? <>&darr;</> : <>&uarr;</>;
};
