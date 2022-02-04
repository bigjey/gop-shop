import express from 'express';
import { categoryRouter } from './routes/category';
import { productRouter } from './routes/product';
import { productReviewRouter } from './routes/productReview';

export const api = express.Router();

api.use(categoryRouter);
api.use(productRouter);
api.use(productReviewRouter);
