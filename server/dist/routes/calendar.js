"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const calendar_1 = __importDefault(require("../controllers/calendar"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const calendar_2 = require("../validation/calendar");
const router = (0, express_1.Router)();
// Get availability for a listing
router.get("/:listingId", calendar_1.default.getAvailability);
// router.post(
//   "/:listingId/availability",
//   authorize({ isHost: true }),
//   validateSchema(createAvailabilitySchema),
//   calendarController.createAvailability
// );
// Update availability
router.patch("/:listingId", (0, auth_1.authorize)({ isHost: true }), (0, validate_1.default)(calendar_2.updateAvailabilitySchema), calendar_1.default.updateAvailability);
// Block dates
// router.post(
//   "/:listingId/block",
//   authorize({ isHost: true }),
//   validateSchema(updateAvailabilitySchema),
//   calendarController.blockDates
// );
// Set custom pricing
// router.post(
//   "/:listingId/price",
//   authorize({ isHost: true }),
//   validateSchema(customPricingSchema),
//   calendarController.setCustomPricing
// );
// Set minimum stay
router.put("/:listingId/minimum-stay", (0, auth_1.authorize)({ isHost: true }), (0, validate_1.default)(calendar_2.minimumStaySchema), calendar_1.default.setMinimumStay);
exports.default = router;
