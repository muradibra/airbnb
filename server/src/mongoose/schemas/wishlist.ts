import mongoose, { Schema, Types } from "mongoose";

interface IWishlist extends Document {
  user: Types.ObjectId;
  name: string;
  listings: Types.ObjectId[];
  privacy: string;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  listings: [
    {
      type: Types.ObjectId,
      ref: "Listing",
    },
  ],
  privacy: {
    type: String,
    enum: ["private", "public"],
    default: "private",
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

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
