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
        if (!req.query?.startDate) return true;
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
  availability: {
    in: ["body"],
    optional: true,
    isArray: {
      options: { min: 0 },
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value)) return true;

        for (const period of value) {
          if (!period.startDate || !period.endDate) {
            throw new Error(
              "Each availability period must have start and end dates"
            );
          }

          const startDate = new Date(period.startDate);
          const endDate = new Date(period.endDate);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date format in availability");
          }

          if (endDate <= startDate) {
            throw new Error(
              "End date must be after start date in availability periods"
            );
          }
        }
        return true;
      },
    },
  },
};
