import { Schema } from "express-validator";

export const updateAvailabilitySchema: Schema = {
  startDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "Start date must be a valid ISO date",
    },
  },
  endDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "End date must be a valid ISO date",
    },
    optional: true, // Make it optional to allow single date selection
    custom: {
      options: (value, { req }) => {
        if (value) {
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(value);

          // ✅ Allow single-day blocking (startDate === endDate)
          if (endDate.getTime() >= startDate.getTime()) {
            return true;
          }

          // ❌ If endDate is before startDate, throw an error
          throw new Error("End date must be after or equal to start date");
        }
        return true;
      },
    },
  },
  isBlocked: {
    in: ["body"],
    isBoolean: true,
    optional: true,
  },
  customPrice: {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "Custom price must be a positive number",
    },
    optional: true,
  },
  minimumStay: {
    in: ["body"],
    isInt: {
      options: { min: 1 },
      errorMessage: "Minimum stay must be at least 1 night",
    },
    optional: true,
  },
  note: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "Note cannot exceed 500 characters",
    },
    optional: true,
  },
};

export const createAvailabilitySchema: Schema = {
  startDate: {
    in: ["body"],
    isISO8601: true,
    toDate: true,
    errorMessage: "Invalid start date",
  },
  endDate: {
    in: ["body"],
    isISO8601: true,
    toDate: true,
    errorMessage: "Invalid end date",
  },
  isBlocked: {
    in: ["body"],
    isBoolean: true,
    optional: true,
    errorMessage: "Invalid value for isBlocked",
  },
  customPrice: {
    in: ["body"],
    isFloat: { options: { min: 0 } },
    optional: true,
    errorMessage: "Invalid value for customPrice",
  },
  minimumStay: {
    in: ["body"],
    isInt: { options: { min: 1 } },
    optional: true,
    errorMessage: "Invalid value for minimumStay",
  },
  note: {
    in: ["body"],
    isString: true,
    optional: true,
    errorMessage: "Invalid value for note",
  },
};

export const blockDatesSchema: Schema = {
  startDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "Start date must be a valid ISO date",
    },
  },
  endDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "End date must be a valid ISO date",
    },
    custom: {
      options: (value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      },
    },
  },
  note: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "Note cannot exceed 500 characters",
    },
    optional: true,
  },
};

export const customPricingSchema: Schema = {
  startDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "Start date must be a valid ISO date",
    },
  },
  endDate: {
    in: ["body"],
    isISO8601: {
      options: { strict: true },
      errorMessage: "End date must be a valid ISO date",
    },
    custom: {
      options: (value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      },
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
  },
  note: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "Note cannot exceed 500 characters",
    },
    optional: true,
  },
};

export const minimumStaySchema: Schema = {
  defaultMinimumStay: {
    in: ["body"],
    isInt: {
      options: { min: 1 },
      errorMessage: "Default minimum stay must be at least 1 night",
    },
  },
};
