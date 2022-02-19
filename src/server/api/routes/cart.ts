import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const cartRouter = express.Router();

cartRouter
  .route('/cart')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.locals.user) {
        const cart = await prisma.cartItem.findMany({
          where: {
            userId: res.locals.user.id,
          },
        });
        res.json({ cart });
        return;
      } else {
        const cart = await prisma.cartItem.findMany({
          where: {
            sessionId: req.session.id,
          },
        });
        res.json({ cart });
        return;
      }
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, qty } =
        req.body as Prisma.CartItemUncheckedCreateInput;
      if (res.locals.user) {
        const cart = await prisma.cartItem.findUnique({
          where: {
            productId_userId_sessionId: {
              sessionId: req.session.id,
              productId,
              userId: null,
            },
          },
        });
        res.json({ cart });
        return;
      } else {
        const cart = await prisma.cartItem.create({
          data: {
            sessionId: req.session.id,
            productId,
            qty: Number(qty),
          },
        });
        res.json({ cart });
        return;
      }
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, qty } =
        req.body as Prisma.CartItemUncheckedUpdateInput;
      if (res.locals.user) {
        const cart = await prisma.cartItem.updateMany({
          where: {
            userId: res.locals.user.id,
            productId: Number(productId),
          },
          data: {
            qty,
          },
        });
        res.json({ cart });
        return;
      } else {
        const cart = await prisma.cartItem.updateMany({
          where: {
            sessionId: req.session.id,
            productId: Number(productId),
          },
          data: {
            qty,
          },
        });
        res.json({ cart });
        return;
      }
    } catch (error) {
      next(error);
    }
  });
