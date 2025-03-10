import { Router } from "express";
import { authorize } from "../middlewares/auth";
import calendarController from "../controllers/calendar";
import validateSchema from "../middlewares/validate";
import {
  updateAvailabilitySchema,
  blockDatesSchema,
  customPricingSchema,
  minimumStaySchema,
  createAvailabilitySchema,
} from "../validation/calendar";

const router = Router();

// Get availability for a listing
router.get("/:listingId", calendarController.getAvailability);

// router.post(
//   "/:listingId/availability",
//   authorize({ isHost: true }),
//   validateSchema(createAvailabilitySchema),
//   calendarController.createAvailability
// );

// Update availability
router.put(
  "/:listingId",
  authorize({ isHost: true }),
  validateSchema(updateAvailabilitySchema),
  calendarController.updateAvailability
);

// Block dates
router.post(
  "/:listingId/block",
  authorize({ isHost: true }),
  validateSchema(blockDatesSchema),
  calendarController.blockDates
);

// Set custom pricing
router.post(
  "/:listingId/price",
  authorize({ isHost: true }),
  validateSchema(customPricingSchema),
  calendarController.setCustomPricing
);

// Set minimum stay
router.put(
  "/:listingId/minimum-stay",
  authorize({ isHost: true }),
  validateSchema(minimumStaySchema),
  calendarController.setMinimumStay
);

export default router;
