import { model, Schema, Types } from "mongoose";

const bookingSchema = new Schema({
  host: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  renter: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  guestsCount: {
    adults: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      required: true,
    },
    infants: {
      type: Number,
      required: true,
    },
    pets: {
      type: Number,
      required: true,
    },
  },
  listing: {
    type: Types.ObjectId,
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
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = model("booking", bookingSchema);

export default Booking;
