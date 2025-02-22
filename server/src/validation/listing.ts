import { Schema } from "express-validator";

export const getListingsSchema: Schema = {
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
    isString: true,
    optional: true,
  },
  endDate: {
    in: ["query"],
    isString: true,
    optional: true,
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
  adultCount: {
    in: ["query"],
    isInt: true,
    optional: true,
  },
  childrenCount: {
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

export const createListingSchema: Schema = {
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
  bedroomCount: {
    in: ["body"],
    isInt: true,
  },
  bedCount: {
    in: ["body"],
    isInt: true,
    isLength: {
      options: { min: 1 },
    },
  },
  bathroomCount: {
    in: ["body"],
    isInt: true,
  },
  amenities: {
    in: ["body"],
    isArray: true,
  },
  pricePerNight: {
    in: ["body"],
    isInt: true,
  },
  discountedPricePerNight: {
    in: ["body"],
    isInt: true,
    optional: true,
  },
  maxGuestCount: {
    in: ["body"],
    isInt: true,
  },
  address: {
    in: ["body"],
    customSanitizer: {
      options: (value) => {
        // Ensure location is parsed correctly
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch (e) {
            throw new Error("Location must be a valid JSON object");
          }
        }
        return value;
      },
    },
    custom: {
      options: (value) => {
        if (typeof value !== "object" || value === null) {
          throw new Error("Location must be an object");
        }

        const requiredFields = ["country", "city", "street"];
        for (const field of requiredFields) {
          if (
            !value[field] ||
            typeof value[field] !== "string" ||
            value[field].trim().length < 2
          ) {
            throw new Error(
              `${field} is required and must be at least 2 characters long`
            );
          }
        }

        return true;
      },
    },
  },
  images: {
    custom: {
      errorMessage: "At least 5 images are required",
      options: (_, { req }) => {
        return req.files && req.files.length >= 5;
      },
    },
  },
};
