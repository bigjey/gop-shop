import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  AdminProductsFilter,
  PaginationOptions,
  SortOptions,
} from '../../../shared/types';

const prisma = new PrismaClient({
  rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productRouter = express.Router();

productRouter
  .route('/products')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as AdminProductsFilter &
        SortOptions &
        PaginationOptions;
      const {
        sortField = 'name',
        sortOrder = 'asc',
        perPage = '2',
        page = '1',
      } = query;
      const take = parseInt(perPage);
      if (Number.isNaN(take) || take < 1) {
        res.status(400).send('perPage must be a positive number');
        return;
      }
      const skip = parseInt(page);
      if (Number.isNaN(skip) || skip < 1) {
        res.status(400).send('Page must be a positive number');
        return;
      }
      const products = await prisma.product.findMany({
        orderBy: { [sortField]: sortOrder },
        take,
        skip: (skip - 1) * take,
      });
      res.json(products);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.ProductUncheckedCreateInput;
      delete data.id;
      const product = await prisma.product.create({
        data,
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });

productRouter
  .route('/products/:id')
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = req.body as Prisma.ProductUncheckedCreateInput;
      delete data.id;
      const product = await prisma.product.update({
        where: {
          id,
        },
        data,
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.delete({
        where: {
          id,
        },
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });
