type Category = {
  id: number;
  name: string;
  isActive: boolean;
  parentId: number | null;
  sortOrder: number;
  children?: Category[];
};

type CategoryFormValues = Omit<Category, "id" | "children">;
