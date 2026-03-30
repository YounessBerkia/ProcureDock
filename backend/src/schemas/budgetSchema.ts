import { z } from 'zod';

export const createBudgetSchema = z.object({
  productId: z.string().optional(),
  vendorId: z.string().optional(),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  amount: z.number().positive('Betrag muss positiv sein'),
  quantity: z.number().int().positive().default(1),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  purchaseDate: z.string().min(1, 'Datum ist erforderlich'),
  quarter: z.string().optional(),
  year: z.number().int().optional(),
  status: z.enum(['planned', 'approved', 'ordered', 'delivered']).default('planned'),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
