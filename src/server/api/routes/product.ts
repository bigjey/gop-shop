import express, { Request, Response, NextFunction } from 'express';
import { Prisma, Product, UserRole } from '@prisma/client';

import {
  AdminProductsFilter,
  PaginationOptions,
  SortOptions,
  ProductGetRelatedDataOptions,
} from '../../../shared/types';
import { checkUserRole } from '../../utils/checkUserRole';
import { prisma } from '../../client';
import { validateRequest } from '../../utils/validateRequest';
import joi from 'joi';

export const productRouter = express.Router();

productRouter
  .route('/products')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as AdminProductsFilter &
        SortOptions<Product> &
        PaginationOptions &
        ProductGetRelatedDataOptions;

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
      const { getReviews = 'false', getImages = 'false' } = query;
      const includeSettings: Prisma.ProductInclude = {};

      if (getReviews === 'true') {
        includeSettings.reviews = true;
      } else if (getReviews === 'false') {
        includeSettings.reviews = false;
      }

      if (getImages === 'true') {
        includeSettings.images = true;
      } else if (getImages === 'false') {
        includeSettings.images = false;
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
  .post(
    checkUserRole([UserRole.Admin, UserRole.SuperAdmin]),
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
  );

productRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/products/:id')
  .get(
    validateRequest({
      query: joi.object({
        includeReviews: joi.valid('1', 'true'),
        includeImages: joi.valid('1', 'true'),
        includeSpecs: joi.valid('1', 'true'),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const query = req.query as {
          includeReviews?: '1' | 'true';
          includeImages?: '1' | 'true';
          includeSpecs?: '1' | 'true';
        };

        const { includeReviews, includeImages, includeSpecs } = query;

        const include: Prisma.ProductInclude = {};

        if (includeReviews) {
          include.reviews = { orderBy: { createdAt: 'desc' } };
        }

        if (includeImages) {
          include.images = { orderBy: { sortOrder: 'asc' } };
        }

        if (includeSpecs) {
          include.specPreset = {
            include: {
              presetGroups: {
                include: {
                  presetGroupItems: {
                    include: {
                      spec: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          };
          include.specValues = {
            select: {
              specPresetGroupItemId: true,
              value: true,
            },
          };
        }

        const product = await prisma.product.findUnique({
          where: {
            id,
          },
          include: Object.keys(include).length ? include : undefined,
        });

        if (!product) {
          res.status(404).send('Product not found');
          return;
        }

        const variationsList = (await prisma.$queryRaw`
          SELECT DISTINCT pp.id, pp.name, s.name, sv.value
          FROM "Product" p
          JOIN "Product" pp ON pp."productGroupId" = p."productGroupId"
          inner JOIN "ProductGroup" pg ON p."productGroupId" = pg."id"
          inner JOIN "ProductGroupSpec" pgs ON pgs."productGroupId" = pg."id"
          inner JOIN "Spec" s ON s."id" = pgs."specId"
          inner JOIN "SpecPreset" sp ON sp."id" = p."specPresetId"
          inner JOIN "SpecPresetGroup" spg ON spg."presetId" = sp."id"
          inner JOIN "SpecPresetGroupItem" spgi ON spgi."presetGroupId" = spg."id" AND spgi."specId" = s.id
          inner JOIN "SpecValue" sv ON sv."specPresetGroupItemId" = spgi."id" AND sv."productId" = pp."id"
          WHERE p.id = ${id}
          order by pp.id, s."name"
        `) as any[];

        const variants: Record<string, any[]> = {};
        for (const p of variationsList) {
          if (variants[p.name] === undefined) {
            variants[p.name] = [];
          }
          if (!variants[p.name].includes(p.value)) {
            variants[p.name].push(p.value);
          }
        }

        res.json({ product, variants });
        return;
      } catch (error) {
        next(error);
      }
    }
  )
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
