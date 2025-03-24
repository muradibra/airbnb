"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    listing: {
        type: mongoose_1.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxLength: 500 },
    createdAt: { type: Date, default: Date.now },
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
