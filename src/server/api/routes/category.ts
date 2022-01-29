import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const categoryRouter = express.Router();

categoryRouter
  .route("/categories/root")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
      });
      res.send(categories);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .route("/categories/tree")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: { children: { include: { children: true } } },
      });
      res.send(categories);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .route("/categories")
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parentId = null, isActive } = req.body;
      console.log(req.body);
      if (!name) {
        res.sendStatus(400);
        return;
      }
      const category = await prisma.category.create({
        data: {
          name,
          parentId,
          isActive,
        },
      });
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .route("/categories/:id")
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parentId = null, sortOrder, isActive = true } = req.body;
      console.log(req.body);
      const category = await prisma.category.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          parentId,
          sortOrder,
          isActive,
        },
      });
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  });
