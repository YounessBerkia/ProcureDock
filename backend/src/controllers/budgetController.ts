import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createBudgetSchema, updateBudgetSchema } from '../schemas/budgetSchema';

export const getAllBudget = async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await prisma.budgetEntry.findMany({
      include: { product: true, vendor: true },
      orderBy: { purchaseDate: 'desc' },
    });
    res.status(200).json(entries);
  } catch (error) {
    console.error('getAllBudget error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBudgetStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await prisma.budgetEntry.findMany();

    const totalBudget = 50000;

    // Total spent = sum of amount × quantity
    const totalSpent = entries.reduce((sum, e) => sum + e.amount * e.quantity, 0);

    // Breakdown by category
    const byCategory: Record<string, number> = {};
    for (const entry of entries) {
      byCategory[entry.category] = (byCategory[entry.category] ?? 0) + entry.amount * entry.quantity;
    }

    // Breakdown by quarter
    const byQuarter: Record<string, number> = {};
    for (const entry of entries) {
      byQuarter[entry.quarter] = (byQuarter[entry.quarter] ?? 0) + entry.amount * entry.quantity;
    }

    res.status(200).json({
      totalBudget,
      totalSpent: Math.round(totalSpent * 100) / 100,
      remaining: Math.round((totalBudget - totalSpent) * 100) / 100,
      byCategory,
      byQuarter,
    });
  } catch (error) {
    console.error('getBudgetStats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createBudgetEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = createBudgetSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Validierungsfehler', errors: result.error.issues });
      return;
    }

    const { purchaseDate, ...rest } = result.data;
    const date = new Date(purchaseDate);

    // Auto-derive quarter and year if not provided
    const quarter = rest.quarter ?? `Q${Math.ceil((date.getMonth() + 1) / 3)}-${date.getFullYear()}`;
    const year = rest.year ?? date.getFullYear();

    const entry = await prisma.budgetEntry.create({
      data: { ...rest, purchaseDate: date, quarter, year },
      include: { product: true, vendor: true },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('createBudgetEntry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBudgetEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.budgetEntry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Eintrag nicht gefunden' });
      return;
    }

    const result = updateBudgetSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Validierungsfehler', errors: result.error.issues });
      return;
    }

    const { purchaseDate, ...rest } = result.data;
    const data: Record<string, unknown> = { ...rest };

    if (purchaseDate) {
      const date = new Date(purchaseDate);
      data.purchaseDate = date;
      if (!rest.quarter) data.quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)}-${date.getFullYear()}`;
      if (!rest.year) data.year = date.getFullYear();
    }

    const entry = await prisma.budgetEntry.update({
      where: { id },
      data,
      include: { product: true, vendor: true },
    });

    res.status(200).json(entry);
  } catch (error) {
    console.error('updateBudgetEntry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBudgetEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.budgetEntry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Eintrag nicht gefunden' });
      return;
    }

    await prisma.budgetEntry.delete({ where: { id } });
    res.status(200).json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    console.error('deleteBudgetEntry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
