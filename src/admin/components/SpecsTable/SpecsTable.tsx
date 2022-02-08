import React from 'react';
import { Spec } from '@prisma/client';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type SpecsTableProps = {
  items?: Spec[];
  onDeleteClick(spec: Spec): void;
};

export const SpecsTable: React.FC<SpecsTableProps> = (props) => {
  const { items = [], onDeleteClick } = props;

  if (!items.length) {
    return <>No items</>;
  }

  return (
    <Table hover>
      <thead>
        <tr>
          <td>id</td>
          <td>name</td>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <SpecTableRow key={item.id} spec={item} onDelete={onDeleteClick} />
        ))}
      </tbody>
    </Table>
  );
};

export const SpecTableRow: React.FC<{
  spec: Spec;
  onDelete(spec: Spec): void;
}> = (props) => {
  const { spec, onDelete } = props;
  return (
    <tr>
      <td>{spec.id}</td>
      <td>
        <Link to={`/specs/${spec.id}`}>{spec.name}</Link>
      </td>
      <td align="right">
        <Button size="sm" variant="danger" onClick={() => onDelete(spec)}>
          delete
        </Button>
      </td>
    </tr>
  );
};
