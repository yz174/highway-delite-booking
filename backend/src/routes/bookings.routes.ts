import { Router } from 'express';
import { createBooking } from '../controllers/bookings.controller';

const router = Router();

router.post('/', createBooking);

export default router;
