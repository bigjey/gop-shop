import express, { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../client';

export const productSpecValueRouter = express.Router();

productSpecValueRouter
  .route('/productSpecValues')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specValue = await prisma.specValue.findMany({
        orderBy: { id: 'asc' },
      });
      res.send(specValue);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecValueUncheckedCreateInput;
      const specValue = await prisma.specValue.create({
        data,
      });
      res.json(specValue);
      return;
    } catch (error) {
      next(error);
    }
  });

productSpecValueRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productSpecValues/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const specValue = await prisma.specValue.findUnique({
        where: {
          id,
        },
      });

      if (!specValue) {
        res.status(404).send('Spec value not found');
        return;
      }

      res.json(specValue);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetUncheckedUpdateInput;
      const specValue = await prisma.specValue.update({
        where: { id: Number(req.params.id) },
        data,
      });
      res.send(specValue);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specValue = await prisma.specValue.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(specValue);
      return;
    } catch (error) {
      next(error);
    }
  });
