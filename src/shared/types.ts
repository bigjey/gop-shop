import {
  Category,
  Spec,
  SpecPreset,
  SpecPresetGroup,
  SpecPresetGroupItem,
  UserRole,
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

export type ProductGetRelatedDataOptions = {
  getReviews?: string;
  getImages?: string;
};

export type SortOptions<T> = {
  sortField?: keyof T;
  sortOrder?: 'asc' | 'desc';
};

export type PaginationOptions = {
  perPage?: string;
  page?: string;
};

export type AuthTokenPayload = {
  id: number;
};

export type UserAuth = {
  id: number;
  name: string;
  role: UserRole;
};
