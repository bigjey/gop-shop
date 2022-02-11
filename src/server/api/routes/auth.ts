import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthTokenPayload } from '../../../shared/types';
import authTokenValidator from '../../utils/authTokenValidator';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
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
  });
