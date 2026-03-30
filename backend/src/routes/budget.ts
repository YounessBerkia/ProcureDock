import { Router } from 'express';
import {
  getAllBudget,
  getBudgetStats,
  createBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
} from '../controllers/budgetController';

const router = Router();

// /stats must come before /:id to avoid being treated as an ID
router.get('/stats', getBudgetStats);
router.get('/', getAllBudget);
router.post('/', createBudgetEntry);
router.put('/:id', updateBudgetEntry);
router.delete('/:id', deleteBudgetEntry);

export default router;
