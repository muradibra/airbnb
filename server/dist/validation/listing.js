"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListingSchema = exports.getListingsSchema = void 0;
exports.getListingsSchema = {
    category: {
        in: ["query"],
        isString: true,
        optional: true,
    },
    skip: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    take: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    startDate: {
        in: ["query"],
        isISO8601: {
            options: { strict: true },
            errorMessage: "Start date must be a valid ISO date",
        },
        optional: true,
    },
    endDate: {
        in: ["query"],
        isISO8601: {
            options: { strict: true },
            errorMessage: "End date must be a valid ISO date",
        },
        optional: true,
        custom: {
            options: (value, { req }) => {
                var _a;
                if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.startDate))
                    return true;
                if (new Date(value) <= new Date(req.query.startDate)) {
                    throw new Error("End date must be after start date");
                }
                return true;
            },
        },
    },
    bedrooms: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    bathrooms: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    amenities: {
        in: ["query"],
        isArray: true,
        optional: true,
    },
    priceRange: {
        in: ["query"],
        isString: true,
        optional: true,
    },
    adults: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    children: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    infantsCount: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    petsCount: {
        in: ["query"],
        isInt: true,
        optional: true,
    },
    location: {
        in: ["query"],
        isString: true,
        optional: true,
    },
    sortBy: {
        in: ["query"],
        isString: true,
        optional: true,
    },
    sortOrder: {
        in: ["query"],
        isString: true,
        optional: true,
    },
};
exports.createListingSchema = {
    title: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 5, max: 75 },
        },
    },
    description: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 10, max: 1500 },
        },
    },
    category: {
        in: ["body"],
        isString: true,
    },
    "address.country": {
        in: ["body"],
        isString: true,
    },
    "address.city": {
        in: ["body"],
        isString: true,
    },
    "address.street": {
        in: ["body"],
        isString: true,
    },
    "address.state": {
        in: ["body"],
        isString: true,
        optional: true,
    },
    "address.zip": {
        in: ["body"],
        isString: true,
        optional: true,
    },
    maxGuestCount: {
        in: ["body"],
        isInt: { errorMessage: "maxGuestCount must be an integer" },
        toInt: true,
    },
    bedroomCount: {
        in: ["body"],
        isInt: { errorMessage: "bedroomCount must be an integer" },
        toInt: true,
    },
    bedCount: {
        in: ["body"],
        isInt: { errorMessage: "bedCount must be an integer" },
        toInt: true,
    },
    bathroomCount: {
        in: ["body"],
        isInt: { errorMessage: "bathroomCount must be an integer" },
        toInt: true,
    },
    amenities: {
        in: ["body"],
        isArray: true,
    },
    pricePerNight: {
        in: ["body"],
        isInt: { errorMessage: "pricePerNight must be an integer" },
        toInt: true,
    },
    images: {
        custom: {
            errorMessage: "At least 5 images are required",
            options: (_, { req }) => {
                const newImages = req.files || [];
                const existingImages = req.body.images || [];
                // console.log("newImages:", newImages);
                // console.log("existingImages:", existingImages);
                // Ensure we have at least 5 images total
                if (newImages.length + existingImages.length < 5) {
                    throw new Error("At least 5 images are required");
                }
                return true;
            },
        },
    },
    // availability: {
    //   in: ["body"],
    //   optional: true,
    //   isArray: {
    //     options: { min: 0 },
    //   },
    //   custom: {
    //     options: (value) => {
    //       if (!Array.isArray(value)) return true;
    //       for (const period of value) {
    //         if (!period.startDate || !period.endDate) {
    //           throw new Error(
    //             "Each availability period must have start and end dates"
    //           );
    //         }
    //         const startDate = new Date(period.startDate);
    //         const endDate = new Date(period.endDate);
    //         if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    //           throw new Error("Invalid date format in availability");
    //         }
    //         if (endDate <= startDate) {
    //           throw new Error(
    //             "End date must be after start date in availability periods"
    //           );
    //         }
    //       }
    //       return true;
    //     },
    //   },
    // },
};
