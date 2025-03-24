"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    host: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    guest: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    guestsCount: {
        adults: {
            type: Number,
            required: true,
            default: 1,
        },
        children: {
            type: Number,
            required: true,
            default: 0,
        },
        infants: {
            type: Number,
            required: true,
            default: 0,
        },
        pets: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    listing: {
        type: mongoose_1.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Booking = (0, mongoose_1.model)("Booking", bookingSchema);
exports.default = Booking;
