import { Category } from "@prisma/client";

export type DeleteOptions =
  | { type: "all" }
  | { type: "move"; newParentId: number | null };

export type CategoryWithChildren = Category & { children?: Category[] };
