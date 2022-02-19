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
        res.json(cart);
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

      const where: Prisma.CartItemWhereUniqueInput = {};
      const create: Prisma.CartItemUncheckedCreateInput = {
        productId,
        qty,
      };

      if (res.locals.user) {
        where.productId_userId = {
          productId,
          userId: res.locals.user.id,
        };
        create.userId = res.locals.user.id;
      } else {
        where.productId_sessionId = {
          productId,
          sessionId: req.session.id,
        };
        create.sessionId = req.session.id;
      }

      const cartItem = await prisma.cartItem.findUnique({
        where,
      });

      const result = await prisma.cartItem.upsert({
        where: {
          id: cartItem?.id || -1,
        },
        create,
        update: {
          qty: {
            increment: qty,
          },
        },
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, qty } =
        req.body as Prisma.CartItemUncheckedCreateInput;
      const where: Prisma.CartItemWhereUniqueInput = {};

      if (res.locals.user) {
        where.productId_userId = {
          productId,
          userId: res.locals.user.id,
        };
      } else {
        where.productId_sessionId = {
          productId,
          sessionId: req.session.id,
        };
      }

      const cart = await prisma.cartItem.update({
        where,
        data: {
          qty,
        },
      });
      res.json(cart);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body as Prisma.CartItemUncheckedCreateInput;
      const where: Prisma.CartItemWhereUniqueInput = {};

      if (res.locals.user) {
        where.productId_userId = {
          productId,
          userId: res.locals.user.id,
        };
      } else {
        where.productId_sessionId = {
          productId,
          sessionId: req.session.id,
        };
      }

      const result = await prisma.cartItem.delete({
        where,
      });

      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  });
