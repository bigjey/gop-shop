import Express from "express";
import path from "path";

import { api } from "./api";

export const app = Express();

const projectRoot = process.cwd();

app.use("/api", api);

app.use(Express.static(path.resolve(projectRoot, "dist/client")));

app.get("/admin", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "dist/client/admin/admin.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "dist/client/shop/shop.html"));
});
