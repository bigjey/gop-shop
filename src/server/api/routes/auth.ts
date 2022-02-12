import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { AuthTokenPayload } from '../../../shared/types';
import authTokenValidator from '../../utils/authTokenValidator';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

const transport = nodemailer.createTransport({
  host: 'smtp.emaillabs.net.pl',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.NODEMAILER_LOGIN,
    pass: process.env.NODEMAILER_PWD,
  },
});

export const authRouter = express.Router();

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
          .send('Email, password, repeatedPassword are required fields');
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

      const payload: AuthTokenPayload = { id: user.id };

      if (match) {
        const token = jwt.sign(
          payload,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          process.env.JWT_SECRET!,
          { expiresIn: '6h' }
        );

        res.json({ token });
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
        res.status(400);
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
        link: `${process.env.BASE_URL}/api/auth/reset/${user.id}/${resetToken}`,
      });
      return;
    } catch (error) {
      next(error);
    }
  });

authRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .param('token', (req, res, next, token) => {
    if (!token || token.length < 1) {
      res.status(400).send('provide a token');
      return;
    }
    next();
  })
  .route('/auth/reset/:id/:token')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, token } = req.params;
      const { password, repeatPassword } = req.body;

      if (password !== repeatPassword) {
        res.status(400).send(`Passwords don't match`);
        return;
      }

      const tokenFromDb = await prisma.resetToken.findFirst({
        where: { userId: Number(id) },
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

      const tokensMatch = await bcrypt.compare(token, tokenFromDb.token);

      if (!tokensMatch) {
        res.status(400);
        return;
      }

      const newPassword = await bcrypt.hash(password, 10);

      const transactionResult = await prisma.$transaction([
        prisma.user.update({
          where: { id: Number(id) },
          data: { password: newPassword },
        }),
        prisma.resetToken.deleteMany({
          where: { userId: Number(id) },
        }),
      ]);

      res.json({ transactionResult });
      return;
    } catch (error) {
      next(error);
    }
  });
