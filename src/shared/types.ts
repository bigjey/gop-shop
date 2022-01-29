type Category = {
  id: number;
  name: string;
  isActive: boolean;
  parentId: number | null;
  sortOrder: number;
  children?: Category[];
};

type CategoryFormValue = Omit<Category, "id" | "children">;
