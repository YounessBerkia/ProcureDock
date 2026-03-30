import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    res.json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
