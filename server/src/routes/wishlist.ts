import { Router } from "express";
import { authorize } from "../middlewares/auth";
import wishlistController from "../controllers/wishlist";
import validateSchema from "../middlewares/validate";
import {
  createWishlistSchema,
  updateWishlistSchema,
} from "../validation/wishlist";

const router = Router();

// Get all wishlists for the current user
router.get("/", authorize({}), wishlistController.getAll);

// Get a specific wishlist
router.get("/:id", authorize({}), wishlistController.getById);

// Create a new wishlist
router.post(
  "/create",
  authorize({}),
  validateSchema(createWishlistSchema),
  wishlistController.create
);

// Add a listing to a wishlist
router.post("/add-listing", authorize({}), wishlistController.addListing);

// Remove a listing from a wishlist
router.delete(
  "/:wishlistId/listings/:listingId",
  authorize({}),
  wishlistController.removeListing
);

// Update a wishlist
router.put(
  "/:id",
  authorize({}),
  validateSchema(updateWishlistSchema),
  wishlistController.update
);

// Delete a wishlist
router.delete("/:id", authorize({}), wishlistController.remove);

export default router;
