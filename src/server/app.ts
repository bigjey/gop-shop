import express from 'express';
import path from 'path';
import 'dotenv/config';
import fileUpload from 'express-fileupload';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

import { errorHandler } from './utils/errorHandler';

import { api } from './api';

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload());

const projectRoot = process.cwd();

app.use(express.static(path.resolve(projectRoot, 'dist/client')));
app.use(express.static(path.resolve(projectRoot, 'src/shop')));

declare module 'express-session' {
  interface SessionData {
    userId: number;
    lastSignIn: number;
  }
}

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use('/api', api);

app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(projectRoot, 'dist/client/admin/admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(projectRoot, 'dist/client/shop/shop.html'));
});

app.use(errorHandler);
