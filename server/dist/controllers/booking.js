"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookings = exports.updateBookingStatus = exports.getHostBookings = exports.createBooking = void 0;
const booking_1 = __importDefault(require("../mongoose/schemas/booking"));
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const calendar_1 = __importDefault(require("../mongoose/schemas/calendar"));
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId, checkInDate, checkOutDate, totalPrice, guestCount, paymentStatus, } = req.body;
        const listing = yield listing_1.default.findById(listingId);
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        const booking = yield booking_1.default.create({
            host: listing.host,
            listing: listingId,
            guest: userId,
            checkInDate,
            checkOutDate,
            totalPrice,
            guestCount,
            paymentStatus,
            status: "pending",
        });
        res.status(201).json({ message: "Booking request created", booking });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createBooking = createBooking;
const getHostBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const listings = yield listing_1.default.find({ host: hostId });
        const listingIds = listings.map((l) => l._id);
        const bookings = yield booking_1.default.find({ listing: { $in: listingIds } })
            .populate("listing")
            .populate("guest", "name email avatar")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Bookings fetched", bookings });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getHostBookings = getHostBookings;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { bookingId } = req.params;
        const { status } = req.body; // "approved" or "rejected"
        const booking = yield booking_1.default.findById(bookingId)
            .populate("listing host")
            .select("-__v");
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        if (booking.listing.host.toString() !== hostId.toString()) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }
        booking.status = status;
        yield booking.save();
        // If approved, update calendar dates as booked
        if (status === "approved") {
            let calendar = yield calendar_1.default.findOne({ listing: booking.listing._id });
            if (!calendar) {
                calendar = new calendar_1.default({ listing: booking.listing._id, dates: [] });
            }
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const datesToBook = [];
            for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
                datesToBook.push(new Date(d));
            }
            datesToBook.forEach((day) => {
                const existing = calendar.dates.find((entry) => new Date(entry.date).getTime() === new Date(day).getTime());
                if (existing) {
                    existing.isBooked = true;
                }
                else {
                    calendar.dates.push({
                        date: day,
                        isBooked: true,
                        isBlocked: false,
                        customPrice: 0, // Default value, adjust as needed
                        // minimumStay: 1, // Default value, adjust as needed
                        note: "", // Default value, adjust as needed
                    });
                }
            });
            yield calendar.save();
            const guest = yield user_1.default.findOne(booking.guest);
            if (!guest) {
                res.status(404).json({ message: "Guest not found" });
                return;
            }
            guest.bookings.push(booking._id);
            yield guest.save();
        }
        res.status(200).json({ message: `Booking ${status}`, booking });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateBookingStatus = updateBookingStatus;
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const bookings = yield booking_1.default.find({ renter: userId })
            .populate("listing")
            .sort({ createdAt: -1 });
        res.status(200).json({ bookings });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserBookings = getUserBookings;
const bookingController = {
    createBooking: exports.createBooking,
    getHostBookings: exports.getHostBookings,
    updateBookingStatus: exports.updateBookingStatus,
    getUserBookings: exports.getUserBookings,
};
exports.default = bookingController;
