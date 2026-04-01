import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  GeizhalsNoVendorOfferError,
  GeizhalsRobotsBlockedError,
  scrapeGeizhalsOfferForVendor,
} from '../scrapers/geizhals';

// rate limit to avoid hammering geizhals
const SCRAPE_COOLDOWN_MS = 2000;
let lastScrapeAt = 0;

export const getAllPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.query;

    const prices = await prisma.price.findMany({
      where: productId ? { productId: Array.isArray(productId) ? productId[0] : productId } : undefined,
      include: {
        product: true,
        vendor: true,
      },
      orderBy: { scrapedAt: 'desc' },
    });

    res.status(200).json(prices);
  } catch (error) {
    console.error('[Prices] Fetch failed:', error);
    res.status(500).json({ message: 'Preise konnten nicht geladen werden' });
  }
};

export const getPriceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const price = await prisma.price.findUnique({
      where: { id },
      include: {
        product: true,
        vendor: true,
      },
    });

    if (!price) {
      res.status(404).json({ message: 'Preis nicht gefunden' });
      return;
    }

    res.status(200).json(price);
  } catch (error) {
    console.error('[Prices] Get by ID failed:', { id: req.params.id, error });
    res.status(500).json({ message: 'Preisdetails konnten nicht geladen werden' });
  }
};

export const createPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, vendorId, price, url, inStock } = req.body as {
      productId: string;
      vendorId: string;
      price: number;
      url: string;
      inStock?: boolean;
    };

    if (!productId || !vendorId || price === undefined || !url) {
      res.status(400).json({ message: 'Missing required fields: productId, vendorId, price, url' });
      return;
    }

    const newPrice = await prisma.price.create({
      data: {
        productId,
        vendorId,
        price,
        url,
        inStock: inStock ?? true,
      },
      include: {
        product: true,
        vendor: true,
      },
    });

    res.status(201).json(newPrice);
  } catch (error) {
    console.error('[Prices] Create failed:', { body: req.body, error });
    res.status(500).json({ message: 'Preis konnte nicht gespeichert werden' });
  }
};

// scrape price from geizhals.de for a specific product/vendor combo
export const scrapePriceFromGeizhals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, vendorId } = req.body as {
      productId?: string;
      vendorId?: string;
    };

    if (!productId || !vendorId) {
      res.status(400).json({ message: 'Missing required fields: productId, vendorId' });
      return;
    }

    // check rate limit - dont want to get blocked
    const now = Date.now();
    const remainingCooldown = SCRAPE_COOLDOWN_MS - (now - lastScrapeAt);

    if (remainingCooldown > 0) {
      res.status(429).json({
        message: `Scrape rate limit exceeded. Please retry in ${Math.ceil(remainingCooldown / 1000)} second(s).`,
      });
      return;
    }

    const [product, vendor] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.vendor.findUnique({ where: { id: vendorId } }),
    ]);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    lastScrapeAt = now;

    const scrapedOffer = await scrapeGeizhalsOfferForVendor({
      productName: product.name,
      vendorName: vendor.name,
    });

    const createdPrice = await prisma.price.create({
      data: {
        productId: product.id,
        vendorId: vendor.id,
        price: scrapedOffer.price,
        url: scrapedOffer.url,
        inStock: scrapedOffer.inStock,
      },
      include: {
        product: true,
        vendor: true,
      },
    });

    res.status(201).json(createdPrice);
  } catch (error) {
    if (error instanceof GeizhalsNoVendorOfferError) {
      res.status(404).json({ message: error.message });
      return;
    }

    if (error instanceof GeizhalsRobotsBlockedError) {
      res.status(500).json({ message: error.message });
      return;
    }

    console.error('[Prices] Scrape failed:', { body: req.body, error });
    res.status(500).json({ message: 'Preis konnte nicht von Geizhals abgerufen werden' });
  }
};
