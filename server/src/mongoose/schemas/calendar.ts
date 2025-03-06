import mongoose, { Schema, Types } from "mongoose";

const calendarSchema = new Schema({
  listing: {
    type: Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  dates: [
    {
      date: {
        type: Date,
        required: true,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
      customPrice: {
        type: Number,
        default: null,
      },
      minimumStay: {
        type: Number,
        default: 1,
      },
      note: {
        type: String,
      },
    },
  ],
  defaultMinimumStay: {
    type: Number,
    default: 1,
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

// Index for faster queries
calendarSchema.index({ listing: 1, "dates.date": 1 });

const Calendar = mongoose.model("Calendar", calendarSchema);

export default Calendar;
