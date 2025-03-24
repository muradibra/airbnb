import { Request, Response } from "express";
import Listing from "../mongoose/schemas/listing";
import Booking from "../mongoose/schemas/booking";
import Review from "../mongoose/schemas/review";

const getAll = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;

    const reviews = await Review.find({ listing: listingId }).populate(
      "user",
      "name"
    );

    res.status(200).json({ message: "Reviews fetched", reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { listingId, rating, comment } = req.body;

    const existingReview = await Review.findOne({
      listing: listingId,
      user: userId,
    });

    if (existingReview) {
      res.status(400).json({
        message: "You have already reviewed this listing",
      });
      return;
    }

    const reservation = await Booking.findOne({
      listing: listingId,
      guest: userId,
      checkOutDate: { $lt: new Date() },
      status: "completed",
      paymentStatus: "paid",
    });

    if (!reservation) {
      res.status(403).json({
        message:
          "You can only write a review after your stay has ended and payment is completed.",
      });
      return;
    }

    const review = new Review({
      listing: listingId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review created", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    // Find the review and check if it belongs to the user
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      res.status(404).json({
        message: "Review not found or you don't have permission to update it",
      });
      return;
    }
    // Update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reviewId = req.params.id;

    // Find and delete the review if it belongs to the user
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      res.status(404).json({
        message: "Review not found or you don't have permission to delete it",
      });
      return;
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const reviewController = {
  getAll,
  create,
  update,
  remove,
};

export default reviewController;
