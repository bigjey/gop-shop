import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productSpecPresetGroupRouter = express.Router();

productSpecPresetGroupRouter
  .route('/productSpecPresetGroups')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPresetGroup = await prisma.specPresetGroup.findMany({
        orderBy: { name: 'asc' },
      });
      res.send(specPresetGroup);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetGroupUncheckedCreateInput;
      const specPresetGroup = await prisma.specPresetGroup.create({
        data,
      });
      res.json(specPresetGroup);
      return;
    } catch (error) {
      next(error);
    }
  });

productSpecPresetGroupRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productSpecPresetGroups/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const specPresetGroup = await prisma.specPresetGroup.findUnique({
        where: {
          id,
        },
      });

      if (!specPresetGroup) {
        res.status(404).send('Spec not found');
        return;
      }

      res.json(specPresetGroup);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetGroupUncheckedUpdateInput;

      const specPresetGroup = await prisma.specPresetGroup.update({
        where: { id: Number(req.params.id) },
        data,
      });
      res.send(specPresetGroup);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPresetGroup = await prisma.specPresetGroup.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(specPresetGroup);
      return;
    } catch (error) {
      next(error);
    }
  });
