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
const mongoose_1 = require("mongoose");
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const calendar_1 = __importDefault(require("../mongoose/schemas/calendar"));
const booking_1 = __importDefault(require("../mongoose/schemas/booking"));
const location_1 = __importDefault(require("../mongoose/schemas/location"));
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const review_1 = __importDefault(require("../mongoose/schemas/review"));
// import Wishlist from "../mongoose/schemas/wishlist";
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, skip = 0, take = 12, startDate, endDate, bedroomCount, bathroomCount, amenities, priceRange, adults, children, location, sortBy = "createdAt", sortOrder = "desc", } = req.matchedData;
        const { guests } = req.query;
        const filterQuery = {};
        if (category) {
            filterQuery.category = category;
        }
        // Filter by location ID
        if (location) {
            filterQuery.address = location;
        }
        // Filter by date availability
        if (startDate && endDate) {
            filterQuery.$and = [
                {
                    // No calendar entries exist for these dates
                    _id: {
                        $nin: yield calendar_1.default.distinct("listing", {
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
                        $nin: yield booking_1.default.distinct("listing", {
                            status: { $ne: "cancelled" },
                            checkInDate: { $lte: new Date(endDate) },
                            checkOutDate: { $gte: new Date(startDate) },
                        }),
                    },
                },
            ];
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
        // Filter by guest count (adults + children)
        // const totalGuestCount = Number(adults) + Number(children);
        if (guests && typeof guests === "string") {
            filterQuery.maxGuestCount = Number(guests);
        }
        // Sorting
        const sortQuery = {};
        if (sortBy === "price") {
            sortQuery.pricePerNight = sortOrder === "asc" ? 1 : -1;
        }
        else if (sortBy === "rating") {
            sortQuery.averageRating = sortOrder === "asc" ? 1 : -1;
        }
        else {
            sortQuery.createdAt = sortOrder === "asc" ? 1 : -1;
        }
        const hasMore = (yield listing_1.default.countDocuments(filterQuery)) > Number(skip) + Number(take);
        const listings = yield listing_1.default.find(filterQuery)
            .populate("category", "name description icon")
            .populate("host", "_id name email avatar")
            .populate("address")
            .populate("reviews")
            .select("-__v")
            .sort(sortQuery)
            .skip(+skip)
            .limit(+take);
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
            listing.images = listing.images.map((image) => image.startsWith(BASE_URL) ? image : `${BASE_URL}/${image}`);
        });
        const listingsCount = yield listing_1.default.countDocuments(filterQuery);
        res.status(200).json({
            success: true,
            count: listingsCount,
            hasMore,
            listings,
            skip: Number(skip),
            take: Number(take),
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const listing = yield listing_1.default.findById(id)
            .populate("category", "name description icon")
            .populate("host", "name email avatar")
            .populate("address")
            // .populate("amenities")
            // .populate("calendar")
            .populate("reservations");
        // .populate("reviews")
        // .populate("reviews.user");
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        const calendar = yield calendar_1.default.findOne({ listing: id });
        if (!calendar) {
            res.status(404).json({ message: "Calendar not found" });
            return;
        }
        listing.images = listing.images.map((image) => {
            return `${process.env.BASE_URL}/${image}`;
        });
        if (typeof listing.host === "object" && "avatar" in listing.host) {
            listing.host.avatar = `${process.env.BASE_URL}/${listing.host.avatar}`;
        }
        res
            .status(200)
            .json({ message: "Listing details fetched", listing, calendar });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const getHostListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const host = yield user_1.default.findById(new mongoose_1.Types.ObjectId(user));
        if (!host || host.role !== "host") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const listings = yield listing_1.default.find({ host: user })
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const getHostListingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const host = yield user_1.default.findById(new mongoose_1.Types.ObjectId(userId));
        if (!host || host.role !== "host") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const listing = yield listing_1.default.findById({ _id: id, host: userId }).populate("address");
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        listing.images = listing.images.map((l) => {
            return `${process.env.BASE_URL}/${l}`;
        });
        res.status(200).json({ message: "Listing fetched", listing });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const host = yield user_1.default.findById(user);
        if (!host || host.role !== "host") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const { title, description, category, address, amenities, bedroomCount, bedCount, bathroomCount, maxGuestCount, pricePerNight, } = req.matchedData;
        const images = req.files.map((file) => file.path.replace(/\\/g, "/"));
        let location = yield location_1.default.findOne({
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode,
        });
        if (!location)
            location = yield location_1.default.create(address);
        const listing = yield listing_1.default.create({
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
        yield calendar_1.default.create({
            listing: listing._id,
            dates: [],
            defaultPrice: pricePerNight,
        });
        yield calendar_1.default.updateOne({
            listing: listing._id,
        }, {
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
        });
        host.listings.push(listing._id);
        yield host.save();
        res.status(200).json({
            message: "Listing created",
            // item: listing,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, description, address, category, amenities, pricePerNight, discountedPricePerNight, bedroomCount, bedCount, bathroomCount, maxGuestCount, images, } = req.matchedData;
        const uploadedImages = req.files.map((file) => file.path.replace(/\\/g, "/"));
        const listing = yield listing_1.default.findOne({ _id: id, host: user }).populate("address");
        if ((listing === null || listing === void 0 ? void 0 : listing.host.toString()) !== (user === null || user === void 0 ? void 0 : user.toString())) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        let updatedImages = [];
        let uploadIndex = 0;
        for (const img of images) {
            if (img.type === "old") {
                // Keep existing image URL in its new position
                img.value = img.value.split(`${process.env.BASE_URL}/`).pop();
                updatedImages.push(img.value);
            }
            else if (img.type === "new") {
                // Replace placeholder with the next uploaded image
                if (uploadIndex < uploadedImages.length) {
                    updatedImages.push(uploadedImages[uploadIndex]);
                    uploadIndex++;
                }
                else {
                    console.warn("⚠ Missing uploaded image for:", img);
                }
            }
        }
        // console.log("✅ Final Ordered Images:", updatedImages);
        const location = yield location_1.default.findOne({
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode,
        });
        let newLocation;
        if (!location)
            newLocation = yield location_1.default.create(address);
        const updatedListing = yield listing.updateOne({
            title,
            description,
            address: newLocation === null || newLocation === void 0 ? void 0 : newLocation._id,
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const listing = yield listing_1.default.findOneAndDelete({ _id: id });
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        yield calendar_1.default.findOneAndDelete({ listing: id });
        yield booking_1.default.deleteMany({ listing: id });
        yield location_1.default.deleteOne({ _id: listing.address });
        yield review_1.default.deleteMany({ listing: id });
        // await Wishlist.deleteMany({ listing: id });
        const host = yield user_1.default.findById(user);
        if (host) {
            host.listings = host.listings.filter((listingId) => listingId.toString() !== id);
            yield host.save();
        }
        res.status(200).json({ message: "Listing deleted" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const listingController = {
    getAll,
    getById,
    getHostListings,
    getHostListingById,
    create,
    update,
    remove,
};
exports.default = listingController;
