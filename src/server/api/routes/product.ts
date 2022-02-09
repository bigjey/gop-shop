import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient, Product } from '@prisma/client';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import { upload } from '../../utils/imageUploader';
import {
  AdminProductsFilter,
  PaginationOptions,
  SortOptions,
  ProductGetRelatedInfoOptions,
} from '../../../shared/types';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

cloudinary.v2.config();

export const productRouter = express.Router();

productRouter
  .route('/products')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as AdminProductsFilter &
        SortOptions<Product> &
        PaginationOptions &
        ProductGetRelatedInfoOptions;

      //SORTING & PAGINATION
      const {
        sortField = 'name',
        sortOrder = 'asc',
        perPage = '20',
        page = '1',
      } = query;

      if (Number.isNaN(Number(perPage)) || Number(perPage) < 1) {
        res.status(400).send('perPage must be a positive number');
        return;
      }

      if (Number.isNaN(Number(page)) || Number(page) < 1) {
        res.status(400).send('Page must be a positive number');
        return;
      }

      //FILTERING
      const {
        id = null,
        name = null,
        priceFrom = null,
        priceTo = null,
        categoryId = null,
        isFeatured = null,
        isActive = null,
        isAvailable = null,
      } = query;

      const filterSettings: Prisma.ProductWhereInput = { AND: [] };

      if (id === null) {
        //
      } else if (Array.isArray(id)) {
        if (id.some((e) => Number.isNaN(Number(e)))) {
          res.status(400).send('id must be of type int');
          return;
        }
        filterSettings.id = { in: id.map((e) => Number(e)) };
      } else {
        if (Number.isNaN(Number(id))) {
          res.status(400).send('id must be of type int');
          return;
        }
        filterSettings.id = Number(id);
      }

      if (name && name.length > 0)
        filterSettings.name = { contains: name, mode: 'insensitive' };

      if (priceFrom === null) {
        //
      } else if (Number.isNaN(priceFrom) || Number(priceFrom) < 0) {
        res.status(400).send('priceFrom cannot be NaN or be less then zero');
        return;
      } else {
        (filterSettings.AND as Prisma.ProductWhereInput[]).push({
          price: { gte: Number(priceFrom) },
        });
      }

      if (priceTo === null) {
        //
      } else if (Number.isNaN(priceTo) || Number(priceTo) < 0) {
        res.status(400).send('priceTo cannot be NaN or be less then zero');
        return;
      } else {
        (filterSettings.AND as Prisma.ProductWhereInput[]).push({
          price: { lte: Number(priceTo) },
        });
      }

      if (categoryId === null) {
        //
      } else if (Array.isArray(categoryId)) {
        if (categoryId.some((e) => Number.isNaN(Number(e)))) {
          res.status(400).send('categoryId must be of type int');
          return;
        }
        filterSettings.categoryId = { in: categoryId.map((e) => Number(e)) };
      } else {
        if (Number.isNaN(Number(categoryId))) {
          res.status(400).send('categoryId must be of type int');
          return;
        }
        filterSettings.categoryId = Number(categoryId);
      }

      if (isFeatured === null) {
        //
      } else if (isFeatured === 'true') {
        filterSettings.isFeatured = true;
      } else if (isFeatured === 'false') {
        filterSettings.isFeatured = false;
      }

      if (isActive === null) {
        //
      } else if (isActive === 'true') {
        filterSettings.isActive = true;
      } else if (isActive === 'false') {
        filterSettings.isActive = false;
      }

      if (isAvailable === null) {
        //
      } else if (isAvailable === 'true') {
        filterSettings.isAvailable = true;
      } else if (isAvailable === 'false') {
        filterSettings.isAvailable = false;
      }

      //GETTING RELATED DATA
      const { getReviews = 'false' } = query;
      const includeSettings: Prisma.ProductInclude = {};

      if (getReviews === 'true') {
        includeSettings.reviews = true;
      } else if (getReviews === 'false') {
        includeSettings.reviews = false;
      }

      const products = await prisma.product.findMany({
        orderBy: { [sortField]: sortOrder },
        take: Number(perPage),
        skip: (Number(page) - 1) * Number(perPage),
        where: filterSettings,
        include: includeSettings,
      });

      res.json(products);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.ProductUncheckedCreateInput;
      delete data.id;
      const product = await prisma.product.create({
        data,
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });

productRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/products/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        res.status(404).send('Category not found');
        return;
      }

      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = req.body as Prisma.ProductUncheckedCreateInput;
      delete data.id;
      const product = await prisma.product.update({
        where: {
          id,
        },
        data,
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await prisma.product.delete({
        where: {
          id,
        },
      });
      res.json(product);
      return;
    } catch (error) {
      next(error);
    }
  });

productRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/products/:id/specs')
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data: Omit<Prisma.SpecValueUncheckedCreateInput, 'productId'>[] =
        req.body;

      const [deletedSpecValues, createdSpecValues] = await prisma.$transaction([
        prisma.specValue.deleteMany({
          where: { productId: id },
        }),

        prisma.specValue.createMany({
          data: data.map((el) => ({ ...el, productId: id })),
        }),
      ]);
      res.json({ deletedSpecValues, createdSpecValues });
      return;
    } catch (error) {
      next(error);
    }
  });

productRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/products/:id/gallery')
  .post(async function (req, res, next) {
    const files = req.files?.images as fileUpload.UploadedFile[];
    // console.log(files);
    const productId = Number(req.params.id);
    if (files) {
      try {
        const uploaded = [] as Prisma.ProductImageUncheckedCreateInput[];
        let sortOrder = 1;
        for (const file of files) {
          const result: cloudinary.UploadApiResponse = (await upload(
            file
          )) as cloudinary.UploadApiResponse;
          uploaded.push({
            publicId: result.public_id,
            productId,
            sortOrder,
          });
          sortOrder++;
        }
        const dbResponse = await prisma.productImage.createMany({
          data: uploaded,
        });
        console.log(uploaded);
        res.json(dbResponse);
      } catch (err) {
        console.log({ err });
        next(err);
      }
    } else {
      res.send('not okay');
    }
  });
