import { Router } from 'express';
import { getAllVendors, getVendorById, rateVendor } from '../controllers/vendorsController';

const router = Router();

router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.post('/:id/rate', rateVendor);

export default router;
