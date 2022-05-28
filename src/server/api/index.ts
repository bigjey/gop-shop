import express from 'express';
import { categoryRouter } from './routes/category';
import { productRouter } from './routes/product';
import { productReviewRouter } from './routes/productReview';
import { productSpecRouter } from './routes/productSpec';
import { productSpecPresetRouter } from './routes/productSpecPreset';
import { productSpecPresetGroupRouter } from './routes/productSpecPresetGroup';
import { productSpecPresetGroupItemRouter } from './routes/productSpecPresetGroupItem';
import { productSpecValueRouter } from './routes/productSpecValue';
import { productGalleryRouter } from './routes/productGallery';
import { authRouter } from './routes/auth';
import { cartRouter } from './routes/cart';
import { accountRouter } from './routes/account';
import { orderRouter } from './routes/order';

export const api = express.Router();

api.use(authRouter);

api.use(cartRouter);
api.use(categoryRouter);
api.use(productRouter);
api.use(productReviewRouter);
api.use(productSpecRouter);
api.use(productSpecPresetRouter);
api.use(productSpecPresetGroupRouter);
api.use(productSpecPresetGroupItemRouter);
api.use(productSpecValueRouter);
api.use(productGalleryRouter);

api.use(accountRouter);
api.use(orderRouter);
