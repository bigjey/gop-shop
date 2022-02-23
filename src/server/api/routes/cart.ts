import express, { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import joi from 'joi';

import { CartItemWithIncludes } from '../../../shared/types';
import { validateRequest } from '../../utils/validateRequest';
import { prisma } from '../../client';

export const cartRouter = express.Router();

cartRouter
  .route('/cart')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: Prisma.CartItemWhereInput = {};
      if (res.locals.user) {
        where.userId = res.locals.user.id;
      } else {
        where.sessionId = req.session.id;
      }

      const cart: CartItemWithIncludes[] = await prisma.cartItem.findMany({
        where,
        orderBy: {
          productId: 'asc',
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
      return res.json(cart);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, qty } =
        req.body as Prisma.CartItemUncheckedCreateInput;

      console.log({ productId, qty });

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
          updatedAt: new Date(),
        },
      });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  })
  .put(
    validateRequest({
      body: joi
        .object({
          productId: joi.number().integer().min(1).required(),
          qty: joi.number().integer().min(1).required(),
        })
        .required(),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
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
            updatedAt: new Date(),
          },
        });
        res.json(cart);
        return;
      } catch (error) {
        next(error);
      }
    }
  )
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
