"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const wishlist_1 = __importDefault(require("../controllers/wishlist"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const wishlist_2 = require("../validation/wishlist");
const router = (0, express_1.Router)();
// Get all wishlists for the current user
router.get("/", (0, auth_1.authorize)({}), wishlist_1.default.getAll);
// Get a specific wishlist
router.get("/:id", (0, auth_1.authorize)({}), wishlist_1.default.getById);
// Create a new wishlist
router.post("/create", (0, auth_1.authorize)({}), (0, validate_1.default)(wishlist_2.createWishlistSchema), wishlist_1.default.create);
// Add a listing to a wishlist
router.post("/add-listing", (0, auth_1.authorize)({}), wishlist_1.default.addListing);
// Remove a listing from a wishlist
router.delete("/:wishlistId/listings/:listingId", (0, auth_1.authorize)({}), wishlist_1.default.removeListing);
// Update a wishlist
router.put("/:id", (0, auth_1.authorize)({}), (0, validate_1.default)(wishlist_2.updateWishlistSchema), wishlist_1.default.update);
// Delete a wishlist
router.delete("/:id", (0, auth_1.authorize)({}), wishlist_1.default.remove);
exports.default = router;
