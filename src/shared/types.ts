import {
  Category,
  Spec,
  SpecPreset,
  SpecPresetGroup,
  SpecPresetGroupItem,
} from '@prisma/client';

export type DeleteOptions =
  | { type: 'all' }
  | { type: 'move'; newParentId: number | null };

export type CategoryWithChildren = Category & { children?: Category[] };

export type SpecPresetWithIncludes = SpecPreset & {
  presetGroups?: (SpecPresetGroup & {
    presetGroupItems?: (SpecPresetGroupItem & {
      spec?: Spec;
    })[];
  })[];
};

export type AdminProductsFilter = {
  name?: string;
  priceFrom?: string;
  priceTo?: string;
  categoryId?: string;
  isFeatured?: string;
  isActive?: string;
  isAvailable?: string;
  id?: string | string[];
};

export type AdminProductReviewsFilter = {
  id?: number;
  text?: string;
  score?: number;
  status?: 'new' | 'pending' | 'proofed';
  userId?: number;
  createdAt?: Date | string;
  productId?: number;
};

export type ProductGetRelatedInfoOptions = {
  getReviews?: string;
};

export type SortOptions<T> = {
  sortField?: keyof T;
  sortOrder?: 'asc' | 'desc';
};

export type PaginationOptions = {
  perPage?: string;
  page?: string;
};
