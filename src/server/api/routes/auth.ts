import express, { Request, Response, NextFunction } from 'express';
import { Prisma, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
// import nodemailer from 'nodemailer';
import { AuthTokenPayload, UserAuth } from '../../../shared/types';
import authTokenValidator from '../../utils/authTokenValidator';
import { prisma } from '../../client';

// const transport = nodemailer.createTransport({
//   host: 'smtp.emaillabs.net.pl',
//   port: 587,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: process.env.NODEMAILER_LOGIN,
//     pass: process.env.NODEMAILER_PWD,
//   },
// });

export const authRouter = express.Router();

authRouter
  .route('/auth')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: User | undefined = res.locals.user;
      if (!user) {
        return res.json(null);
      }

      const payload: UserAuth = {
        id: user.id,
        name: user.name || 'anon',
        role: user.role,
      };

      res.json(payload);
      return;
    } catch (error) {
      next(error);
    }
  });

authRouter
  .route('/auth/register')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        repeatPassword,
        name,
        role = 'Customer',
      } = req.body as Prisma.UserUncheckedCreateInput & {
        repeatPassword: string;
      };

      if (!email || !password || !repeatPassword) {
        res
          .status(400)
          .send('Email, password, repeatPassword are required fields');
        return;
      }

      if (password !== repeatPassword) {
        res.status(400).send('Password does not match Repeat password');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      res.json(user);
      return;
    } catch (error) {
      next(error);
    }
  });

authRouter
  .route('/auth/login')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(400).send('Wrong email or password');
        return;
      }

      const match = await bcrypt.compare(password, user.password);

      // const payload: AuthTokenPayload = { id: user.id };

      if (match) {
        req.session.userId = user.id;
        req.session.lastSignIn = Date.now();

        // handle cart items merge

        const idsToKeep = await prisma
          .$queryRawUnsafe<{ id: number }[]>(
            `
          select "id"
          from "CartItem"
          where ("productId", "updatedAt") in (
            select "productId", max("updatedAt")
            from "CartItem"
            where "sessionId" = $1 or "userId" = $2
            group by "productId"
          )
        `,
            req.session.id,
            user.id
          )
          .then((values) => values.map((el) => el.id));

        await prisma.$transaction([
          prisma.cartItem.deleteMany({
            where: {
              id: {
                notIn: idsToKeep,
              },
              OR: [
                {
                  userId: user.id,
                },
                {
                  sessionId: req.session.id,
                },
              ],
            },
          }),
          prisma.cartItem.updateMany({
            where: {
              id: {
                in: idsToKeep,
              },
            },
            data: {
              sessionId: null,
              userId: user.id,
            },
          }),
        ]);

        // const token = jwt.sign(
        //   payload,
        //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //   process.env.JWT_SECRET!,
        //   { expiresIn: '6h' }
        // );

        // res.json({ token });
        res.json(null);
        return;
      } else {
        res.status(400).send('Wrong email or password');
        return;
      }
    } catch (error) {
      next(error);
    }
  });

authRouter
  .route('/auth/logout')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      delete req.session.userId;
      delete req.session.lastSignIn;
      res.json();
      return;
    } catch (error) {
      next(error);
    }
  });

authRouter
  .route('/auth/verify')
  .post(authTokenValidator, (req: Request, res: Response) => {
    const payload: AuthTokenPayload = { id: res.locals.userId };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '6h',
    });

    res.json({ token });
    return;
  });

authRouter
  .route('/auth/forgotPassword')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as {
        email: string;
      };
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.sendStatus(400);
        return;
      }

      await prisma.resetToken.deleteMany({ where: { userId: user.id } });

      const resetToken = randomBytes(32).toString('hex');

      const hash = await bcrypt.hash(resetToken, 10);

      await prisma.resetToken.create({
        data: {
          userId: user.id,
          token: hash,
        },
      });
      res.json({
        userId: user.id,
        token: resetToken,
      });
      return;
    } catch (error) {
      next(error);
    }
  });

authRouter
  .route('/auth/reset')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, repeatPassword, token, userId } = req.body;

      if (!userId) {
        return res.sendStatus(400);
      }

      if (!token || token.length < 2) {
        res.status(400).send(`Invalid token`);
        return;
      }

      if (!password || !repeatPassword || password !== repeatPassword) {
        res.status(400).send(`Passwords don't match`);
        return;
      }

      const tokenFromDb = await prisma.resetToken.findFirst({
        where: { userId: userId },
      });

      if (!tokenFromDb) {
        res.status(400);
        return;
      }

      const tokenExpired =
        new Date(Date.now())[Symbol.toPrimitive]('number') -
          new Date(tokenFromDb.createdAt)[Symbol.toPrimitive]('number') >=
        Number(process.env.RESET_TOKEN_LIFESPAN)
          ? true
          : false;

      if (tokenExpired) {
        res.status(400).send('The token has expired');
        return;
      }

      const match = await bcrypt.compare(token, tokenFromDb.token);

      if (!match) {
        return res.sendStatus(400);
      }

      const newPassword = await bcrypt.hash(password, 10);

      const transactionResult = await prisma.$transaction([
        prisma.user.update({
          where: { id: tokenFromDb.userId },
          data: { password: newPassword },
        }),
        prisma.resetToken.deleteMany({
          where: { userId: tokenFromDb.userId },
        }),
      ]);

      res.json({ transactionResult });
      return;
    } catch (error) {
      next(error);
    }
  });
