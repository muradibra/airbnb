import { Request, Response } from "express";
import { RootFilterQuery } from "mongoose";
import Listing from "../mongoose/schemas/listing";

const getAll = async (req: Request, res: Response) => {
  try {
    const {
      category,
      skip = 0,
      take = 12,
      startDate,
      endDate,
      bedrooms,
      bathrooms,
      amenities,
      priceRange,
      adultCount,
      childrenCount,
      infantsCount,
      petsCount,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filterQuery: RootFilterQuery<any> = {
      $or: [],
      $and: [],
    };

    if (category) {
      filterQuery.categories = category;
    }

    // Filter by location
    if (typeof location === "string") {
      filterQuery.$or = [
        { "address.city": { $regex: new RegExp(location, "i") } },
        { "address.state": { $regex: new RegExp(location, "i") } },
        { "address.country": { $regex: new RegExp(location, "i") } },
      ];
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

    // Filter by bedrooms and bathrooms
    if (bedrooms) {
      filterQuery.bedrooms = { $gte: Number(bedrooms) };
    }
    if (bathrooms) {
      filterQuery.bathrooms = { $gte: Number(bathrooms) };
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

    const listings = await Listing.find(filterQuery)
      .populate("categories")
      .populate("host", "name email")
      .sort(sortQuery)
      .skip(Number(skip))
      .limit(Number(take));

    res.status(200).json({ success: true, count: listings.length, listings });

    res.status(200).json({ message: "GET all listings" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const listingController = {
  getAll,
};

export default listingController;
