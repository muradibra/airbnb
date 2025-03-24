"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = require("../middlewares/auth");
const booking_1 = __importDefault(require("../controllers/booking"));
router.post("/", 
// authorize({ isGuest: true }),
booking_1.default.createBooking);
router.get("/host", (0, auth_1.authorize)({ isHost: true }), booking_1.default.getHostBookings);
router.put("/:bookingId", (0, auth_1.authorize)({ isHost: true }), booking_1.default.updateBookingStatus);
router.get("/", 
// authorize({ isGuest: true }),
booking_1.default.getUserBookings);
exports.default = router;
