import { Request, Response } from "express";
import { RootFilterQuery } from "mongoose";
import Category from "../mongoose/schemas/category";
import Listing from "../mongoose/schemas/listing";
import Calendar from "../mongoose/schemas/calendar";
import Booking from "../mongoose/schemas/booking";

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
      .populate("category", "name description icon")
      .populate("host", "name email")
      .sort(sortQuery)
      .skip(Number(skip))
      .limit(Number(take));

    res
      .status(200)
      .json({ success: true, count: listings.length, hasMore, listings });
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
      .populate("reviews", "rating comment user")
      .populate("reviews.user", "name email");

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

const create = async (req: Request, res: Response) => {
  try {
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
    } = req.matchedData;

    const images = (req.files as Express.Multer.File[]).map((file) =>
      file.path.replace(/\\/g, "/")
    );

    const listing = await Listing.create({
      title,
      description,
      address,
      category,
      images,
      amenities,
      pricePerNight,
      discountedPricePerNight,
      bedroomCount,
      bedCount,
      bathroomCount,
      maxGuestCount,
      host: user,
    });

    res.status(200).json({
      message: "Listing created",
      item: listing,
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
    } = req.matchedData;

    const images = (req.files as Express.Multer.File[]).map((file) =>
      file.path.replace(/\\/g, "/")
    );

    const listing = await Listing.findOne({ _id: id, host: user });

    if (listing?.host.toString() !== user?.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    await listing.updateOne({
      title,
      description,
      address,
      category,
      images,
      amenities,
      pricePerNight,
      discountedPricePerNight,
      bedroomCount,
      bedCount,
      bathroomCount,
      maxGuestCount,
    });

    res.status(200).json({ message: "Listing updated" });
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

    res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const listingController = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default listingController;
