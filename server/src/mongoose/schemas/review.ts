import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
  listing: {
    type: Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: { type: Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const Review = model("review", reviewSchema);

export default Review;
