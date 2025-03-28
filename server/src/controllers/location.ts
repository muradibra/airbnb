import { Request, Response } from "express";
import Listing from "../mongoose/schemas/listing";

const searchLocations = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const locations = await Listing.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "address",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $unwind: "$addressDetails",
      },
      {
        $match: {
          $or: [
            { "addressDetails.city": { $regex: query, $options: "i" } },
            { "addressDetails.state": { $regex: query, $options: "i" } },
            { "addressDetails.country": { $regex: query, $options: "i" } },
            { "addressDetails.street": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: {
            locationId: "$addressDetails._id",
            city: "$addressDetails.city",
            state: "$addressDetails.state",
            country: "$addressDetails.country",
          },
          address: { $first: "$addressDetails.street" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          locationId: "$_id.locationId", // 👈 Location _id
          city: "$_id.city",
          state: "$_id.state",
          country: "$_id.country",
          address: 1,
          listingCount: "$count",
          displayName: {
            $concat: [
              "$_id.city",
              ", ",
              { $ifNull: ["$_id.state", ""] },
              { $cond: [{ $eq: ["$_id.state", null] }, "", ", "] },
              "$_id.country",
            ],
          },
        },
      },
      {
        $sort: { listingCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({ message: "Locations fetched", locations });
  } catch (error) {
    console.error("Error searching locations:", error);
    res.status(500).json({ message: "Error searching locations" });
  }
};

const getPopularLocations = async (req: Request, res: Response) => {
  try {
    const popularLocations = await Listing.aggregate([
      {
        $group: {
          _id: {
            city: "$city",
            state: "$state",
            country: "$country",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          state: "$_id.state",
          country: "$_id.country",
          listingCount: "$count",
          displayName: {
            $concat: [
              "$_id.city",
              ", ",
              { $ifNull: ["$_id.state", ""] },
              { $cond: [{ $eq: ["$_id.state", null] }, "", ", "] },
              "$_id.country",
            ],
          },
        },
      },
      {
        $sort: { listingCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({ message: "Locations fetched", popularLocations });
  } catch (error) {
    console.error("Error getting popular locations:", error);
    res.status(500).json({ message: "Error getting popular locations" });
  }
};

const locationController = {
  searchLocations,
  getPopularLocations,
};

export default locationController;
