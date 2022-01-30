export type DeleteOptions =
  | { type: "all" }
  | { type: "move"; newParentId: number | null };
