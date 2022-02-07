import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productSpecPresetGroupItemRouter = express.Router();

productSpecPresetGroupItemRouter
  .route('/productSpecPresetGroupItems')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPresetGroupItem = await prisma.specPresetGroupItem.findMany({
        orderBy: { id: 'asc' },
      });
      res.send(specPresetGroupItem);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetGroupItemUncheckedCreateInput;
      const specPresetGroupItem = await prisma.specPresetGroupItem.create({
        data,
      });
      res.json(specPresetGroupItem);
      return;
    } catch (error) {
      next(error);
    }
  });

productSpecPresetGroupItemRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productSpecPresetGroupItems/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const specPresetGroupItem = await prisma.specPresetGroupItem.findUnique({
        where: {
          id,
        },
      });

      if (!specPresetGroupItem) {
        res.status(404).send('Spec not found');
        return;
      }

      res.json(specPresetGroupItem);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetUncheckedUpdateInput;
      const specPresetGroupItem = await prisma.specPresetGroupItem.update({
        where: { id: Number(req.params.id) },
        data,
      });
      res.send(specPresetGroupItem);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPresetGroupItem = await prisma.specPresetGroupItem.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(specPresetGroupItem);
      return;
    } catch (error) {
      next(error);
    }
  });
