import { Router } from 'express';
import {
  getAllPrices,
  getPriceById,
  createPrice,
  scrapePriceFromGeizhals,
} from '../controllers/pricesController';

const router = Router();

router.get('/', getAllPrices);
router.post('/scrape', scrapePriceFromGeizhals);
router.get('/:id', getPriceById);
router.post('/', createPrice);
router.put('/:id', async (req, res) => {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const { id } = req.params;
  const { url, price, inStock } = req.body;

  try {
    const updated = await prisma.price.update({
      where: { id },
      data: { url, price, inStock },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update price' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
