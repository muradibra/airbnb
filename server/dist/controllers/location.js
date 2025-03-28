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
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const searchLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            res.status(400).json({ message: "Search query is required" });
            return;
        }
        const locations = yield listing_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error searching locations:", error);
        res.status(500).json({ message: "Error searching locations" });
    }
});
const getPopularLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularLocations = yield listing_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error getting popular locations:", error);
        res.status(500).json({ message: "Error getting popular locations" });
    }
});
const locationController = {
    searchLocations,
    getPopularLocations,
};
exports.default = locationController;
