import React from 'react';
import { CategoryWithChildren } from '../../../shared/types';

export const CategoriesOptions: React.FC<{
  items?: CategoryWithChildren[];
  level?: number;
  exclude?: number[];
}> = (props) => {
  const { items, level = 0, exclude = [] } = props;

  if (!items) {
    return null;
  }

  return (
    <>
      {items.map((c) => {
        if (exclude.includes(c.id)) {
          return null;
        }

        return (
          <React.Fragment key={c.id}>
            <option value={c.id} className={`level-${level}`}>
              {''.padStart(level * 3, '   ')} {c.name}
            </option>
            <CategoriesOptions
              items={c.children}
              level={level + 1}
              exclude={exclude}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
