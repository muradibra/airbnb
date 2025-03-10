import mongoose, { Schema, Types } from "mongoose";

interface ICalendar extends Document {
  listing: Types.ObjectId;
  dates: [
    {
      date: Date;
      isBlocked: boolean;
      isBooked: boolean;
      customPrice: number;
      minimumStay: number;
      note: string;
    }
  ];
  defaultMinimumStay: number;
  createdAt: Date;
  updatedAt: Date;
}

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
        set: (value: Date) =>
          new Date(
            Date.UTC(
              value.getUTCFullYear(),
              value.getUTCMonth(),
              value.getUTCDate(),
              0,
              0,
              0,
              0
            )
          ), // Force UTC
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

const Calendar = mongoose.model<ICalendar>("Calendar", calendarSchema);

export default Calendar;
