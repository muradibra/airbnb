import { Request, Response } from "express";
import { RootFilterQuery, Types } from "mongoose";
import Category from "../mongoose/schemas/category";
import Listing from "../mongoose/schemas/listing";
import Calendar from "../mongoose/schemas/calendar";
import Booking from "../mongoose/schemas/booking";
import Location from "../mongoose/schemas/location";
import User from "../mongoose/schemas/user";
import Review from "../mongoose/schemas/review";
import Wishlist from "../mongoose/schemas/wishlist";

const getAll = async (req: Request, res: Response) => {
  try {
    const {
      category,
      skip = 0,
      take = 12,
      startDate,
      endDate,
      bedroomCount,
      bathroomCount,
      amenities,
      priceRange,
      adultCount,
      childrenCount,
      infantsCount,
      petsCount,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.matchedData;

    const filterQuery: RootFilterQuery<any> = {
      $or: [],
      $and: [],
    };

    if (category) {
      filterQuery.category = category;
    }

    // Filter by location
    if (typeof location === "string") {
      filterQuery.$and!.push({
        $or: [
          {
            // No calendar entries exist for these dates
            _id: {
              $nin: await Calendar.distinct("listing", {
                dates: {
                  $elemMatch: {
                    date: {
                      $gte: new Date(startDate),
                      $lte: new Date(endDate),
                    },
                    $or: [{ isBlocked: true }, { isBooked: true }],
                  },
                },
              }),
            },
          },
          {
            // No bookings exist for these dates
            _id: {
              $nin: await Booking.distinct("listing", {
                status: { $ne: "cancelled" },
                checkInDate: { $lte: new Date(endDate) },
                checkOutDate: { $gte: new Date(startDate) },
              }),
            },
          },
        ],
      });
    }

    // Filter by date availability
    if (typeof startDate === "string" && typeof endDate === "string") {
      filterQuery.availability = {
        $not: {
          $elemMatch: {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
          },
        },
      };
    }

    // Filter by bedroomCount and bathroomCount
    if (bedroomCount) {
      filterQuery.bedroomCount = { $gte: Number(bedroomCount) };
    }
    if (bathroomCount) {
      filterQuery.bathroomCount = { $gte: Number(bathroomCount) };
    }

    //  Filter by amenities
    if (amenities && typeof amenities === "string") {
      filterQuery.amenities = { $all: amenities.split(",") };
    }

    // Filter by price range
    if (priceRange && typeof priceRange === "string") {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filterQuery.pricePerNight = { $gte: minPrice, $lte: maxPrice };
    }

    // Filter by guest restrictions
    if (adultCount) {
      filterQuery["guestRestrictions.maxAdults"] = { $gte: Number(adultCount) };
    }
    if (childrenCount) {
      filterQuery["guestRestrictions.maxChildren"] = {
        $gte: Number(childrenCount),
      };
    }
    if (infantsCount) {
      filterQuery["guestRestrictions.maxInfants"] = {
        $gte: Number(infantsCount),
      };
    }
    if (petsCount) {
      filterQuery["guestRestrictions.maxPets"] = { $gte: Number(petsCount) };
    }

    // Sorting
    const sortQuery: any = {};
    if (sortBy === "price") {
      sortQuery.pricePerNight = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "rating") {
      sortQuery.averageRating = sortOrder === "asc" ? 1 : -1;
    } else {
      sortQuery.createdAt = sortOrder === "asc" ? 1 : -1;
    }

    const hasMore =
      (await Listing.countDocuments(filterQuery)) > Number(skip) + Number(take);

    const listings = await Listing.find(filterQuery)
      .populate<{
        category: { name: string; description: string; icon?: string };
      }>("category", "name description icon")
      .populate<{
        host: { _id: string; name: string; email: string; avatar?: string };
      }>("host", "_id name email avatar")
      .populate("address")
      .populate("reviews")
      .select("-__v")
      .sort(sortQuery)
      .skip(Number(skip))
      .limit(Number(take));

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    listings.forEach((listing) => {
      if (listing.category && listing.category.icon) {
        if (!listing.category.icon.startsWith(BASE_URL)) {
          listing.category.icon = `${BASE_URL}/${listing.category.icon}`;
        }
      }
      if (listing.host && listing.host.avatar) {
        if (!listing.host.avatar.startsWith(BASE_URL)) {
          listing.host.avatar = `${BASE_URL}/${listing.host.avatar}`;
        }
      }
      listing.images = listing.images.map((image) =>
        image.startsWith(BASE_URL) ? image : `${BASE_URL}/${image}`
      );
    });

    const listingsCount = await Listing.countDocuments(filterQuery);

    res
      .status(200)
      .json({ success: true, count: listingsCount, hasMore, listings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const listing = await Listing.findById(id)
      .populate("category", "name description icon")
      .populate("host", "name email")
      .populate("address")
      .populate("amenities")
      .populate("calendar")
      .populate("bookings")
      .populate("reviews")
      .populate("reviews.user");

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    res.status(200).json({ message: "Listing details fetched", listing });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHostListings = async (req: Request, res: Response) => {
  try {
    const user = req.user?._id;

    const host = await User.findById(new Types.ObjectId(user));

    if (!host || host.role !== "host") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const listings = await Listing.find({ host: user })
      // .populate("category", "name description icon")
      // .populate("host", "name email")
      .populate("address");
    // .populate("amenities")
    // .populate("calendar")
    // .populate("bookings")
    // .populate("reviews")

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    listings.forEach((listing) => {
      listing.images = listing.images.map((image) => `${BASE_URL}/${image}`);
    });

    res.status(200).json({ message: "Host listings fetched", listings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHostListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const host = await User.findById(new Types.ObjectId(userId));

    if (!host || host.role !== "host") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const listing = await Listing.findById({ _id: id, host: userId }).populate(
      "address"
    );

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    listing.images = listing.images.map((l) => {
      return `${process.env.BASE_URL}/${l}`;
    });

    res.status(200).json({ message: "Listing fetched", listing });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = req.user?._id;

    const host = await User.findById(user);

    if (!host || host.role !== "host") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const {
      title,
      description,
      category,
      address,
      amenities,
      bedroomCount,
      bedCount,
      bathroomCount,
      maxGuestCount,
      pricePerNight,
    } = req.matchedData;

    const images = (req.files as Express.Multer.File[]).map((file) =>
      file.path.replace(/\\/g, "/")
    );

    console.log(images);

    let location = await Location.findOne({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
    });

    if (!location) location = await Location.create(address);

    const listing = await Listing.create({
      title,
      description,
      category,
      address: location._id,
      amenities,
      discountedPricePerNight: Number(pricePerNight),
      bedroomCount: Number(bedroomCount),
      bedCount: Number(bedCount),
      bathroomCount: Number(bathroomCount),
      maxGuestCount: Number(maxGuestCount),
      pricePerNight,
      images,
      host: user,
    });

    // Create dates for the next 365 days
    const dates = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });

    await Calendar.create({
      listing: listing._id,
      dates: [],
    });

    await Calendar.updateOne(
      {
        listing: listing._id,
      },
      {
        $push: {
          dates: {
            $each: dates.map((date) => ({
              date,
              isBlocked: false,
              isBooked: false,
              customer: null,
              customPrice: null,
              minimumStay: 1,
              note: "",
            })),
          },
        },
      }
    );

    host.listings.push(listing._id as Types.ObjectId);
    await host.save();

    res.status(200).json({
      message: "Listing created",
      // item: listing,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.user?._id;

    const {
      title,
      description,
      address,
      category,
      amenities,
      pricePerNight,
      discountedPricePerNight,
      bedroomCount,
      bedCount,
      bathroomCount,
      maxGuestCount,
      images,
    } = req.matchedData;

    const uploadedImages = (req.files as Express.Multer.File[]).map((file) =>
      file.path.replace(/\\/g, "/")
    );

    const listing = await Listing.findOne({ _id: id, host: user }).populate(
      "address"
    );

    if (listing?.host.toString() !== user?.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    let updatedImages: string[] = [];
    let uploadIndex = 0;

    for (const img of images) {
      if (img.type === "old") {
        // Keep existing image URL in its new position
        img.value = img.value.split(`${process.env.BASE_URL}/`).pop();
        updatedImages.push(img.value);
      } else if (img.type === "new") {
        // Replace placeholder with the next uploaded image
        if (uploadIndex < uploadedImages.length) {
          updatedImages.push(uploadedImages[uploadIndex]);
          uploadIndex++;
        } else {
          console.warn("⚠ Missing uploaded image for:", img);
        }
      }
    }

    // console.log("✅ Final Ordered Images:", updatedImages);

    const location = await Location.findOne({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
    });

    let newLocation;
    if (!location) newLocation = await Location.create(address);

    const updatedListing = await listing.updateOne({
      title,
      description,
      address: newLocation?._id,
      category,
      images: updatedImages,
      amenities,
      pricePerNight,
      discountedPricePerNight,
      bedroomCount,
      bedCount,
      bathroomCount,
      maxGuestCount,
    });

    res.status(200).json({ message: "Listing updated", updatedListing });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.user?._id;

    const listing = await Listing.findOneAndDelete({ _id: id, host: user });

    if (listing?.host.toString() !== user?.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    await Calendar.findOneAndDelete({ listing: id });
    await Booking.deleteMany({ listing: id });
    await Location.deleteOne({ _id: listing.address });
    await Review.deleteMany({ listing: id });
    // await Wishlist.deleteMany({ listing: id });

    const host = await User.findById(user);
    if (host) {
      host.listings = host.listings.filter(
        (listingId) => listingId.toString() !== id
      );
      await host.save();
    }

    res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listingController = {
  getAll,
  getById,
  getHostListings,
  getHostListingById,
  create,
  update,
  remove,
};

export default listingController;
