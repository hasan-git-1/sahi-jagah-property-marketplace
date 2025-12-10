import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/bookingService';

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = req.user!.userId;
      const booking = await bookingService.createBooking(clientId, req.body);

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);

      // Check access
      if (
        booking.clientId !== req.user!.userId &&
        booking.ownerId !== req.user!.userId &&
        req.user!.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_RESOURCE',
            message: 'You do not have access to this booking',
          },
        });
      }

      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      const bookings = await bookingService.getUserBookings(userId, role);

      res.json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const role = req.user!.role;

      const booking = await bookingService.updateBooking(id, userId, role, req.body);

      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
