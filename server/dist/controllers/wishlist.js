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
const wishlist_1 = __importDefault(require("../mongoose/schemas/wishlist"));
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const wishlists = yield wishlist_1.default.find({ user: userId }).populate({
            path: "listings",
            select: "title images pricePerNight address averageRating",
        });
        res.status(200).json({
            message: "Wishlists fetched successfully",
            wishlists,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const wishlistId = req.params.id;
        const wishlist = yield wishlist_1.default.findOne({
            _id: wishlistId,
            user: userId,
        }).populate({
            path: "listings",
            select: "title images pricePerNight address averageRating host",
            populate: {
                path: "host",
                select: "name",
            },
        });
        if (!wishlist) {
            res.status(404).json({ message: "Wishlist not found" });
            return;
        }
        res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, privacy = "private" } = req.body;
        const wishlist = yield wishlist_1.default.create({
            user: userId,
            name,
            privacy,
        });
        res.status(201).json({
            message: "Wishlist created successfully",
            wishlist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const addListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { wishlistId, listingId } = req.body;
        // Check if wishlist exists and belongs to user
        const wishlist = yield wishlist_1.default.findOne({
            _id: wishlistId,
            user: userId,
        });
        if (!wishlist) {
            res.status(404).json({ message: "Wishlist not found" });
            return;
        }
        // Check if listing exists
        const listing = yield listing_1.default.findById(listingId);
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        // Check if listing is already in wishlist
        if (wishlist.listings.includes(listingId)) {
            res.status(400).json({ message: "Listing already in wishlist" });
            return;
        }
        // Add listing to wishlist
        wishlist.listings.push(listingId);
        yield wishlist.save();
        res.status(200).json({
            message: "Listing added to wishlist successfully",
            wishlist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const removeListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { wishlistId, listingId } = req.params;
        // Verify both IDs are valid MongoDB ObjectIds
        if (!wishlistId || !listingId) {
            res.status(400).json({
                message: "Both wishlist ID and listing ID are required",
            });
            return;
        }
        const updatedWishlist = yield wishlist_1.default.findOneAndUpdate({
            _id: wishlistId,
            user: userId,
        }, {
            $pull: { listings: listingId },
            $set: { updatedAt: new Date() },
        }, { new: true }).populate({
            path: "listings",
            select: "title images pricePerNight address averageRating",
        });
        if (!updatedWishlist) {
            res.status(404).json({
                message: "Wishlist not found or you don't have permission",
            });
            return;
        }
        res.status(200).json({
            message: "Listing removed from wishlist successfully",
            wishlist: updatedWishlist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const wishlistId = req.params.id;
        const { name, privacy } = req.body;
        const wishlist = yield wishlist_1.default.findOneAndUpdate({
            _id: wishlistId,
            user: userId,
        }, {
            name,
            privacy,
            updatedAt: new Date(),
        }, { new: true });
        if (!wishlist) {
            res.status(404).json({ message: "Wishlist not found" });
            return;
        }
        res.status(200).json({
            message: "Wishlist updated successfully",
            wishlist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const wishlistId = req.params.id;
        const wishlist = yield wishlist_1.default.findOneAndDelete({
            _id: wishlistId,
            user: userId,
        });
        if (!wishlist) {
            res.status(404).json({ message: "Wishlist not found" });
            return;
        }
        res.status(200).json({
            message: "Wishlist deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const wishlistController = {
    getAll,
    getById,
    create,
    addListing,
    removeListing,
    update,
    remove,
};
exports.default = wishlistController;
