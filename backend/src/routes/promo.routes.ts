import { Router } from 'express';
import { validatePromoCode } from '../controllers/promo.controller';

const router = Router();

router.post('/validate', validatePromoCode);

export default router;
