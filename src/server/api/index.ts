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

function upload(file: fileUpload.UploadedFile) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { public_id: file.name, format: file.mimetype.split('/')[1] },
        function (err, result) {
          if (err) {
            console.log({ err });

            reject(err);
          } else {
            console.log({ result });
            resolve(undefined);
          }
        }
      )
      .end(file.data);
  });
}

api.post('/upload', async function (req, res) {
  const files = req.files?.images as fileUpload.UploadedFile[];
  if (files) {
    try {
      for (const file of files) {
        await upload(file);
      }
      res.send('okay');
    } catch (err) {
      console.log({ err });
      res.send('not okay');
    }
  } else {
    res.send('not okay');
  }
});
