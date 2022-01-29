let categories: Category[] = [
  {
    id: 1,
    name: "Food",
    isActive: true,
    parentId: null,
    sortOrder: 1,
    children: [
      {
        id: 2,
        name: "Pizza",
        isActive: true,
        parentId: 1,
        sortOrder: 1,
        children: [],
      },
    ],
  },
];

export const getCategories = () => {
  return new Promise(async (res, rej) => {
    await new Promise((r) => setTimeout(r, 800));

    if (Math.random() > 0.5) {
      rej(new Error("random shit"));
    }

    console.log("fetch categories", categories);

    res(categories);
  });
};

function findCategory(categories: Category[], id: number): Category | null {
  for (const c of categories) {
    if (c.id === id) {
      return c;
    }

    if (c.children) {
      const found = findCategory(c.children, id);
      if (found) return found;
    }
  }

  return null;
}

export const getCategory = (id: number) => {
  return new Promise(async (res, rej) => {
    await new Promise((r) => setTimeout(r, 800));

    if (Math.random() > 0.5) {
      rej(new Error("random shit"));
    }

    const category = findCategory(categories, id);

    console.log("fetch category", id, category);

    res(category);
  });
};

export const createCategory = (data: CategoryFormValue) => {
  return new Promise<void>(async (res, rej) => {
    await new Promise((r) => setTimeout(r, 800));

    if (Math.random() > 0.5) {
      rej(new Error("random shit"));
    }

    const newCategory: Category = {
      ...data,
      id: Math.floor(Math.random() * 1000000),
    };

    if (data.parentId) {
      const parent = findCategory(categories, Number(data.parentId));

      if (!parent) {
        throw new Error("no parent");
      }

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(newCategory);
    } else {
      categories.push(newCategory);
    }

    console.log("create category", newCategory, categories);

    res();
  });
};

export const editCategory = (id: number, data: CategoryFormValue) => {
  return new Promise<void>(async (res, rej) => {
    await new Promise((r) => setTimeout(r, 800));

    if (Math.random() > 0.5) {
      rej(new Error("random shit"));
    }

    const category = findCategory(categories, id);

    if (!category) {
      throw new Error("no category");
    }

    Object.assign(category, data);

    console.log("edit category", category, categories);

    res();
  });
};
