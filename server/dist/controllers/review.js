"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_1 = __importDefault(require("../mongoose/schemas/booking"));
const review_1 = __importDefault(require("../mongoose/schemas/review"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingId = req.params.id;
        const reviews = yield review_1.default.find({ listing: listingId }).populate("user", "name");
        res.status(200).json({ message: "Reviews fetched", reviews });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId, rating, comment } = req.body;
        const existingReview = yield review_1.default.findOne({
            listing: listingId,
            user: userId,
        });
        if (existingReview) {
            res.status(400).json({
                message: "You have already reviewed this listing",
            });
            return;
        }
        const reservation = yield booking_1.default.findOne({
            listing: listingId,
            guest: userId,
            checkOutDate: { $lt: new Date() },
            status: "completed",
            paymentStatus: "paid",
        });
        if (!reservation) {
            res.status(403).json({
                message: "You can only write a review after your stay has ended and payment is completed.",
            });
            return;
        }
        const review = new review_1.default({
            listing: listingId,
            user: userId,
            rating,
            comment,
        });
        yield review.save();
        res.status(201).json({ message: "Review created", review });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const reviewId = req.params.id;
        const { rating, comment } = req.body;
        // Find the review and check if it belongs to the user
        const review = yield review_1.default.findOne({
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
        yield review.save();
        res.status(200).json({
            message: "Review updated successfully",
            review,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const reviewId = req.params.id;
        // Find and delete the review if it belongs to the user
        const review = yield review_1.default.findOneAndDelete({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const reviewController = {
    getAll,
    create,
    update,
    remove,
};
exports.default = reviewController;
