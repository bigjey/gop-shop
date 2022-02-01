import express, { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  rejectOnNotFound: true,
  errorFormat: "pretty",
  log: ["query", "info", "warn", "error"],
});

export const productRouter = express.Router();

productRouter
  .route("/products")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany();
      res.json(products);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        price = 0.0,
        description,
        isAvailable = true,
        isActive = true,
        isFeatured = false,
        saleValue = 0,
        categoryId = null,
      }: Prisma.ProductUncheckedCreateInput = req.body;
      const product = await prisma.product.create({
        data: {
          name,
          price,
          description,
          isAvailable,
          isActive,
          isFeatured,
          saleValue,
          categoryId,
        },
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });
