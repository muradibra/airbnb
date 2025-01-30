import mongoose, { Types } from "mongoose";

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
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
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

const User = mongoose.model("User", userSchema);

export default User;
