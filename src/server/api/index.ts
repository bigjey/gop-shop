import express from 'express';
import { categoryRouter } from './routes/category';
import { productRouter } from './routes/product';
import { productReviewRouter } from './routes/productReview';
import { productSpecRouter } from './routes/productSpec';
import { productSpecPresetRouter } from './routes/productSpecPreset';

export const api = express.Router();

api.use(categoryRouter);
api.use(productRouter);
api.use(productReviewRouter);
api.use(productSpecRouter);
api.use(productSpecPresetRouter);
