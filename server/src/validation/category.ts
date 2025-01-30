import { Schema } from "express-validator";

export const createCategoryValidation: Schema = {
  name: {
    in: ["body"],
    isString: true,
    isLength: {
      errorMessage: "Name should be at least 2 chars long",
      options: { min: 2 },
    },
  },
  description: {
    in: ["body"],
    isString: true,
    optional: true,
  },
  icon: {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (!req.file) {
          throw new Error("Icon is required");
        }

        return true;
      },
    },
  },
};
