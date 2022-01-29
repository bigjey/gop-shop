import express from "express";
import { categoryRouter } from "./routes/category";

export const api = express.Router();

api.use(categoryRouter);
