import React from 'react';
import { SpecPreset } from '@prisma/client';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type SpecPresetsTableProps = {
  items?: SpecPreset[];
  onDeleteClick(spec: SpecPreset): void;
};

export const SpecPresetsTable: React.FC<SpecPresetsTableProps> = (props) => {
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
          <SpecPresetTableRow
            key={item.id}
            preset={item}
            onDelete={onDeleteClick}
          />
        ))}
      </tbody>
    </Table>
  );
};

export const SpecPresetTableRow: React.FC<{
  preset: SpecPreset;
  onDelete(preset: SpecPreset): void;
}> = (props) => {
  const { preset, onDelete } = props;
  return (
    <tr>
      <td>{preset.id}</td>
      <td>
        <Link to={`/specPresets/${preset.id}`}>{preset.name}</Link>
      </td>
      <td align="right">
        <Button size="sm" variant="danger" onClick={() => onDelete(preset)}>
          delete
        </Button>
      </td>
    </tr>
  );
};
