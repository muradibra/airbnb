import { Router } from "express";

const router = Router();

import { authorize } from "../middlewares/auth";
import bookingController from "../controllers/booking";

router.post(
  "/",
  // authorize({ isGuest: true }),
  bookingController.createBooking
);

router.get(
  "/host",
  authorize({ isHost: true }),
  bookingController.getHostBookings
);

router.put(
  "/:bookingId",
  authorize({ isHost: true }),
  bookingController.updateBookingStatus
);

router.get(
  "/",
  // authorize({ isGuest: true }),
  bookingController.getUserBookings
);

export default router;
