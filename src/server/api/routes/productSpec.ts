import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient, Spec } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productSpecRouter = express.Router();

productSpecRouter
  .route('/productSpecs')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specs = await prisma.spec.findMany({
        orderBy: { name: 'asc' },
      });
      res.send(specs);
      return;
    } catch (error) {
      next(error);
    }
  });
