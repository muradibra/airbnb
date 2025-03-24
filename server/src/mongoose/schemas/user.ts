import e from "express";
import mongoose, { Types } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  resetPasswordToken: string | null;
  resetPasswordTokenExpires: Date | null;
  avatar: string;
  bio: string;
  listings: Types.ObjectId[];
  bookings: Types.ObjectId[];
  wishlist: Types.ObjectId[];
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: null,
  },
  avatar: {
    type: String,
    default: "public/avatar/default-avatar.jpg",
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  listings: {
    type: [Types.ObjectId],
    ref: "listing",
  },
  bookings: {
    type: [Types.ObjectId],
    ref: "booking",
  },
  wishlist: {
    type: [Types.ObjectId],
    ref: "listing",
  },
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest",
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
