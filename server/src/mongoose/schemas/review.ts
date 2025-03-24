import { model, Schema, Types } from "mongoose";

interface IReview extends Document {
  listing: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

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

const Review = model<IReview>("Review", reviewSchema);

export default Review;
