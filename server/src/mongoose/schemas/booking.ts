import { model, Schema, Types } from "mongoose";

interface IBooking extends Document {
  host: Types.ObjectId;
  guest: Types.ObjectId;
  guestsCount: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  listing: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

const bookingSchema = new Schema({
  host: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  guest: {
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
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
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
});

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
