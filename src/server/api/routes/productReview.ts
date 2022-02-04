import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  AdminProductReviewsFilter,
  PaginationOptions,
  SortOptions,
} from '../../../shared/types';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productReviewRouter = express.Router();

productReviewRouter
  .route('/productReviews')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as AdminProductReviewsFilter &
        SortOptions &
        PaginationOptions;

      //SORTING & PAGINATION
      const {
        sortField = 'status',
        sortOrder = 'asc',
        perPage = '20',
        page = '1',
      } = query;

      if (Number.isNaN(Number(perPage)) || Number(perPage) < 1) {
        res.status(400).send('perPage must be a positive number');
        return;
      }

      if (Number.isNaN(Number(page)) || Number(page) < 1) {
        res.status(400).send('Page must be a positive number');
        return;
      }

      //FILTERING
      const {
        id = null,
        text = null,
        score = null,
        status = null,
        userId = null,
        productId = null,
      } = query;

      const filterSettings: Prisma.ProductReviewWhereInput = { AND: [] };

      if (id === null) {
        //
      } else if (Array.isArray(id)) {
        if (id.some((e) => Number.isNaN(Number(e)))) {
          res.status(400).send('id must be of type int');
          return;
        }
        filterSettings.id = { in: id.map((e) => Number(e)) };
      } else {
        if (Number.isNaN(Number(id))) {
          res.status(400).send('id must be of type int');
          return;
        }
        filterSettings.id = Number(id);
      }

      if (text && text.length > 0)
        filterSettings.text = { contains: text, mode: 'insensitive' };

      if (productId === null) {
        //
      } else if (Array.isArray(productId)) {
        if (productId.some((e) => Number.isNaN(Number(e)))) {
          res.status(400).send('productId must be of type int');
          return;
        }
        filterSettings.productId = { in: productId.map((e) => Number(e)) };
      } else {
        if (Number.isNaN(Number(productId))) {
          res.status(400).send('productId must be of type int');
          return;
        }
        filterSettings.productId = Number(productId);
      }

      if (score === null) {
        //
      } else if (
        Number.isNaN(score) ||
        Number(score) < 0 ||
        Number(score) > 5
      ) {
        res
          .status(400)
          .send(
            'score cannot be NaN or be less then zero or greater than five'
          );
        return;
      } else {
        (filterSettings.AND as Prisma.ProductReviewWhereInput[]).push({
          score: { gte: Number(score), lt: Number(score) + 1 },
        });
      }

      if (status === null) {
        //
      } else if (status === 'new') {
        filterSettings.status = 'new';
      } else if (status === 'pending') {
        filterSettings.status = 'pending';
      } else if (status === 'proofed') {
        filterSettings.status = 'proofed';
      }

      if (userId === null) {
        //
      } else if (Array.isArray(userId)) {
        if (userId.some((e) => Number.isNaN(Number(e)))) {
          res.status(400).send('userId must be of type int');
          return;
        }
        filterSettings.userId = { in: userId.map((e) => Number(e)) };
      } else {
        if (Number.isNaN(Number(userId))) {
          res.status(400).send('userId must be of type int');
          return;
        }
        filterSettings.userId = Number(userId);
      }

      const reviews = await prisma.productReview.findMany({
        orderBy: { [sortField]: sortOrder },
        take: Number(perPage),
        skip: (Number(page) - 1) * Number(perPage),
        where: filterSettings,
      });

      res.json(reviews);
      return;
    } catch (error) {
      next(error);
    }
  })
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
