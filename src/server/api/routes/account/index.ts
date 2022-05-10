import express from 'express';
import { addressRouter } from './address';

export const accountRouter = express.Router();

accountRouter.use(addressRouter);
