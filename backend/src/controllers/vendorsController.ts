import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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
    console.error('getAllVendors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

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
    console.error('getVendorById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rateVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { rating } = req.body as { rating: number };

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating muss zwischen 1 und 5 liegen' });
      return;
    }

    const existing = await prisma.vendor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Lieferant nicht gefunden' });
      return;
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { rating },
    });

    res.status(200).json(vendor);
  } catch (error) {
    console.error('rateVendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
