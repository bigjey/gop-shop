import express, { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../client';
import joi from 'joi';
import { validateRequest } from '../../../utils/validateRequest';

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
  .post(
    validateRequest({
      body: joi
        .object({
          firstName: joi.string().required(),
          lastName: joi.string().required(),
          postalCode: joi.string().alphanum().required(),
          street: joi.string().required(),
          houseNumber: joi.string().required(),
          city: joi.string().required(),
        })
        .required(),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
  );

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

      const address = await prisma.userAddress.findUnique({
        where: {
          id_userId: {
            id: Number(req.params.id),
            userId: res.locals.user.id,
          },
        },
      });
      if (address) {
        res.send(address);
        return;
      } else {
        res.status(404).send('Record not found.');
        return;
      }
    } catch (error) {
      next(error);
    }
  })
  .put(
    validateRequest({
      body: joi
        .object({
          firstName: joi.string(),
          lastName: joi.string(),
          postalCode: joi.string().alphanum(),
          street: joi.string(),
          houseNumber: joi.string(),
          city: joi.string(),
        })
        .required(),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!res.locals.user) {
          res.sendStatus(401);
          return;
        }

        const data: Prisma.UserAddressUncheckedUpdateInput = req.body;
        const address = await prisma.userAddress.update({
          where: {
            id_userId: {
              id: Number(req.params.id),
              userId: res.locals.user.id,
            },
          },
          data,
        });
        res.send(address);
        return;
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!res.locals.user) {
        res.sendStatus(401);
        return;
      }
      const address = await prisma.userAddress.delete({
        where: {
          id_userId: {
            id: Number(req.params.id),
            userId: res.locals.user.id,
          },
        },
      });
      res.send(address);
      return;
    } catch (error) {
      next(error);
    }
  });
