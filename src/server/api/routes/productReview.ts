import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productReviewRouter = express.Router();

productReviewRouter
  .route('/productReviews')
  .get()
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.ProductReviewUncheckedCreateInput;
      delete data.id;
      const product = await prisma.productReview.create({
        data,
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });

productReviewRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productReviews/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const review = await prisma.productReview.findUnique({
        where: {
          id,
        },
      });

      if (!review) {
        res.status(404).send('Review not found');
        return;
      }

      res.json(review);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = req.body as Prisma.ProductReviewUncheckedCreateInput;
      delete data.id;
      const review = await prisma.productReview.update({
        where: {
          id,
        },
        data,
      });
      res.json(review);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const review = await prisma.productReview.delete({
        where: {
          id,
        },
      });
      res.json(review);
      return;
    } catch (error) {
      next(error);
    }
  });
