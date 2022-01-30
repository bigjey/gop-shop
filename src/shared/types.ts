export type Category = {
  id: number;
  name: string;
  isActive: boolean;
  parentId: number | null;
  sortOrder: number;
  children?: Category[];
};

export type CategoryFormValues = Omit<Category, "id" | "children">;

export type DeleteOptions =
  | { type: "all" }
  | { type: "move"; newParentId: number | null };
