import { Category } from "@prisma/client";

export const createDataTree = (dataset: Category[]) => {
  const hashTable = Object.create(null);
  dataset.forEach(
    (entry: Category) => (hashTable[entry.id] = { ...entry, children: [] })
  );
  const dataTree: Category[] = [];
  dataset.forEach((entry: Category) => {
    if (entry.parentId)
      hashTable[entry.parentId].children.push(hashTable[entry.id]);
    else dataTree.push(hashTable[entry.id]);
  });
  return dataTree;
};
