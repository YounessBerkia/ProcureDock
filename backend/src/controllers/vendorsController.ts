import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// get all vendors with price and budget entry counts
export const getAllVendors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { prices: true, budgetEntries: true } },
      },
    });
    res.status(200).json(vendors);
  } catch (error) {
    console.error('[Vendors] Fetch failed:', error);
    res.status(500).json({ message: 'Lieferanten konnten nicht geladen werden' });
  }
};

export const getVendorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // fetch vendor with their order history
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        budgetEntries: {
          include: { product: true },
          orderBy: { purchaseDate: 'desc' },
        },
        _count: { select: { prices: true } },
      },
    });

    if (!vendor) {
      res.status(404).json({ message: 'Lieferant nicht gefunden' });
      return;
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error('[Vendors] Get by ID failed:', { id: req.params.id, error });
    res.status(500).json({ message: 'Lieferantendetails konnten nicht geladen werden' });
  }
};

export const rateVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { rating } = req.body as { rating: number };

    // validate rating is 1-5
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating muss zwischen 1 und 5 liegen' });
      return;
    }

    const existing = await prisma.vendor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Lieferant nicht gefunden' });
      return;
    }

    // update the rating
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { rating },
    });

    res.status(200).json(vendor);
  } catch (error) {
    console.error('[Vendors] Rating update failed:', { id: req.params.id, rating: req.body.rating, error });
    res.status(500).json({ message: 'Bewertung konnte nicht gespeichert werden' });
  }
};
