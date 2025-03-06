import { Request, Response } from "express";
import Wishlist from "../mongoose/schemas/wishlist";
import Listing from "../mongoose/schemas/listing";

const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const wishlists = await Wishlist.find({ user: userId }).populate({
      path: "listings",
      select: "title images pricePerNight address averageRating",
    });

    res.status(200).json({
      message: "Wishlists fetched successfully",
      wishlists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const wishlistId = req.params.id;

    const wishlist = await Wishlist.findOne({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, privacy = "private" } = req.body;

    const wishlist = await Wishlist.create({
      user: userId,
      name,
      privacy,
    });

    res.status(201).json({
      message: "Wishlist created successfully",
      wishlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addListing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { wishlistId, listingId } = req.body;

    // Check if wishlist exists and belongs to user
    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
    });

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
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
    await wishlist.save();

    res.status(200).json({
      message: "Listing added to wishlist successfully",
      wishlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeListing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { wishlistId, listingId } = req.params;

    // Verify both IDs are valid MongoDB ObjectIds
    if (!wishlistId || !listingId) {
      res.status(400).json({
        message: "Both wishlist ID and listing ID are required",
      });
      return;
    }

    const updatedWishlist = await Wishlist.findOneAndUpdate(
      {
        _id: wishlistId,
        user: userId,
      },
      {
        $pull: { listings: listingId },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    ).populate({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const wishlistId = req.params.id;
    const { name, privacy } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      {
        _id: wishlistId,
        user: userId,
      },
      {
        name,
        privacy,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    res.status(200).json({
      message: "Wishlist updated successfully",
      wishlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const wishlistId = req.params.id;

    const wishlist = await Wishlist.findOneAndDelete({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const wishlistController = {
  getAll,
  getById,
  create,
  addListing,
  removeListing,
  update,
  remove,
};

export default wishlistController;
