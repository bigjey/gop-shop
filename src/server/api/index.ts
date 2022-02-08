import express from 'express';
import { categoryRouter } from './routes/category';
import { productRouter } from './routes/product';
import { productReviewRouter } from './routes/productReview';
import { productSpecRouter } from './routes/productSpec';
import { productSpecPresetRouter } from './routes/productSpecPreset';
import { productSpecPresetGroupRouter } from './routes/productSpecPresetGroup';
import { productSpecPresetGroupItemRouter } from './routes/productSpecPresetGroupItem';
import { productSpecValueRouter } from './routes/productSpecValue';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';

export const api = express.Router();

api.use(categoryRouter);
api.use(productRouter);
api.use(productReviewRouter);
api.use(productSpecRouter);
api.use(productSpecPresetRouter);
api.use(productSpecPresetGroupRouter);
api.use(productSpecPresetGroupItemRouter);
api.use(productSpecValueRouter);

cloudinary.v2.config();

api.post('/upload', async function (req, res) {
  const file = req.files?.ololo as fileUpload.UploadedFile;
  if (file) {
    try {
      cloudinary.v2.uploader
        .upload_stream(
          { public_id: file.name, format: file.mimetype.split('/')[1] },
          function (err, result) {
            if (err) {
              console.log({ err });
              res.send('not okay');
            } else {
              console.log({ result });
              res.send('okay');
            }
          }
        )
        .end(file.data);
    } catch (err) {
      console.log({ err });
      res.send('not okay');
    }
  } else {
    res.send('not okay');
  }
});
