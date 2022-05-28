import express, { Request, Response, NextFunction } from 'express';
import { OrderStatus, Prisma, Product, User } from '@prisma/client';
import { prisma } from '../../client';
import { UserRole } from '@prisma/client';

import joi from 'joi';
import { validateRequest } from '../../utils/validateRequest';

export const orderRouter = express.Router();

orderRouter
  .route('/orders')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }

      const role = res.locals.user.role;

      let orders;

      const include = {
        orderItems: {
          select: {
            productName: true,
            price: true,
            qty: true,
            product: true,
          },
        },
      };

      if (role === UserRole.Customer) {
        orders = await prisma.order.findMany({
          where: { userId: res.locals.user.id },
          include,
        });

        res.send(orders);
        return;
      }

      if (role === UserRole.Admin || role === UserRole.SuperAdmin) {
        orders = await prisma.order.findMany({
          include,
        });

        res.send(orders);
        return;
      }
    } catch (error) {
      next(error);
    }
  })
  .post(
    validateRequest({
      body: joi
        .object({
          details: {
            userId: joi.number().required(),
            deliveryAddressId: joi.number().required(),
            phoneNumber: joi.string().required(),
            email: joi.string().required(),
          },
          products: joi
            .array()
            .items({
              productId: joi.number().required(),
              qty: joi.number().required(),
            })
            .required(),
        })
        .required(),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!res.locals.user) {
          res.sendStatus(401);
          return;
        }

        const details: Prisma.OrderUncheckedCreateInput = req.body.details;
        const products = req.body.products as {
          qty: number;
          productId: number;
        }[];

        const productIds = products.map((p) => p.productId);

        const serverProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        const serverProductById: Record<number, Product> = {};

        for (const p of serverProducts) {
          serverProductById[p.id] = p;
        }

        const order = await prisma.order.create({
          data: {
            ...details,
            orderItems: {
              createMany: {
                data: products.map((p) => ({
                  productId: p.productId,
                  qty: p.qty,
                  price: serverProductById[p.productId].price,
                  productName: serverProductById[p.productId].name,
                })),
              },
            },
          },
        });

        res.send(order);
        return;
      } catch (error) {
        next(error);
      }
    }
  );

orderRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/orders/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!order) {
        res.send(404);
        return;
      }

      const user = res.locals.user as User;

      if (
        user.id === order?.userId ||
        user.role === UserRole.Admin ||
        user.role === UserRole.SuperAdmin
      ) {
        res.send(order);
        return;
      }

      res.send(401);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(
    validateRequest({
      body: joi.object({
        orderStatus: joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!res.locals.user) {
          res.sendStatus(401);
          return;
        }

        const orderStatus = req.body.orderStatus as OrderStatus;

        const order = await prisma.order.findUnique({
          where: { id: Number(req.params.id) },
        });

        if (!order) {
          res.send(404);
          return;
        }

        const user = res.locals.user as User;

        if (
          user.id === order?.userId ||
          user.role === UserRole.Admin ||
          user.role === UserRole.SuperAdmin
        ) {
          const result = await prisma.order.update({
            where: { id: Number(req.params.id) },
            data: { orderStatus },
          });

          res.send(result);
          return;
        }
      } catch (error) {
        next(error);
      }
    }
  );
