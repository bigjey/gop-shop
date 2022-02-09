import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import { upload } from '../../utils/imageUploader';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

cloudinary.v2.config();

export const productGalleryRouter = express.Router();

productGalleryRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/products/:id/gallery')
  .post(async function (req: Request, res: Response, next: NextFunction) {
    const files = (
      Array.isArray(req.files?.images) ? req.files?.images : [req.files?.images]
    ) as fileUpload.UploadedFile[];
    const productId = Number(req.params.id);
    if (files && files[0] !== undefined) {
      try {
        const uploaded = [] as Prisma.ProductImageUncheckedCreateInput[];
        let sortOrder = 1;

        for (const file of files) {
          const result: cloudinary.UploadApiResponse = (await upload(
            file
          )) as cloudinary.UploadApiResponse;

          uploaded.push({
            publicId: result.public_id.substring(
              0,
              result.public_id.lastIndexOf('.')
            ),
            productId,
            sortOrder,
          });
          sortOrder++;
        }

        const dbResponse = await prisma.productImage.createMany({
          data: uploaded,
        });
        res.json(dbResponse);
        return;
      } catch (err) {
        console.log({ err });
        next(err);
      }
    } else {
      res.status(400).send('No files provided');
      return;
    }
  });

productGalleryRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .param('imageId', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('imageId must be int');
      return;
    }
    next();
  })
  .route('/products/:id/gallery/:imageId')
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.imageId);
      const data = req.body as Prisma.ProductImageUncheckedUpdateInput;
      const image = await prisma.productImage.update({
        where: { id },
        data,
      });
      res.send(image);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.imageId);
      const image = await prisma.productImage.delete({
        where: { id },
      });
      res.send(image);
      return;
    } catch (error) {
      next(error);
    }
  });
