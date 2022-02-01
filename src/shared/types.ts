import { Category } from '@prisma/client';

export type DeleteOptions =
  | { type: 'all' }
  | { type: 'move'; newParentId: number | null };

export type CategoryWithChildren = Category & { children?: Category[] };

export type AdminProductsFilter = {
  name?: string;
  priceFrom?: string;
  priceTo?: string;
  categoryId?: string;
  isFeatured?: string;
  isActive?: string;
  isAvailable?: string;
};

export type SortOptions = {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginationOptions = {
  perPage?: string;
  page?: string;
};
