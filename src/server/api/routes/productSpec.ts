import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

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
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecCreateInput;
      const spec = await prisma.spec.create({
        data,
      });
      res.json(spec);
      return;
    } catch (error) {
      next(error);
    }
  });

productSpecRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productSpecs/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const spec = await prisma.spec.findUnique({
        where: {
          id,
        },
      });

      if (!spec) {
        res.status(404).send('Spec not found');
        return;
      }

      res.json(spec);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const spec = await prisma.spec.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
        },
      });
      res.send(spec);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const spec = await prisma.spec.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(spec);
      return;
    } catch (error) {
      next(error);
    }
  });
