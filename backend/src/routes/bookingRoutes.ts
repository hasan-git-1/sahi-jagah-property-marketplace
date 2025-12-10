import { Router } from 'express';
import bookingController from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

router.get('/', bookingController.getUserBookings.bind(bookingController));
router.post('/', bookingController.createBooking.bind(bookingController));
router.get('/:id', bookingController.getBooking.bind(bookingController));
router.put('/:id', bookingController.updateBooking.bind(bookingController));

export default router;
