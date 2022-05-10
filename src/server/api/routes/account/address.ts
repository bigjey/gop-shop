import express, { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../client';

export const addressRouter = express.Router();

addressRouter
  .route('/account/address')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: Prisma.UserAddressWhereInput = {};
      if (res.locals.user) {
        where.userId = res.locals.user.id;
      } else {
        res.sendStatus(401);
        return;
      }

      const addresses = await prisma.userAddress.findMany({
        where,
      });
      res.send(addresses);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Prisma.UserAddressUncheckedCreateInput = req.body;
      if (res.locals.user) {
        data.userId = res.locals.user.id;
      } else {
        res.sendStatus(401);
        return;
      }

      const addresses = await prisma.userAddress.create({
        data,
      });
      res.send(addresses);
      return;
    } catch (error) {
      next(error);
    }
  });

addressRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/account/address/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }
      const where: Prisma.UserAddressWhereInput = {};
      where.id = Number(req.params.id);

      const addresses = await prisma.userAddress.findMany({
        where,
      });
      if (addresses.length > 0) {
        res.send(addresses);
        return;
      } else {
        res.status(404).send('Record not found.');
        return;
      }
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }
      const id = Number(req.params.id);
      const data: Prisma.UserAddressUncheckedUpdateInput = req.body;
      const address = await prisma.userAddress.update({
        where: { id },
        data,
      });
      res.send(address);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }
      const id = Number(req.params.id);
      const address = await prisma.userAddress.delete({
        where: { id },
      });
      res.send(address);
      return;
    } catch (error) {
      next(error);
    }
  });
