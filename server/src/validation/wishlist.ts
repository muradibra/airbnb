import { Schema } from "express-validator";

export const createWishlistSchema: Schema = {
  name: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { min: 1, max: 50 },
    },
  },
  privacy: {
    in: ["body"],
    isIn: {
      options: [["private", "public"]],
    },
    optional: true,
  },
};

export const updateWishlistSchema: Schema = {
  name: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { min: 1, max: 50 },
    },
    optional: true,
  },
  privacy: {
    in: ["body"],
    isIn: {
      options: [["private", "public"]],
    },
    optional: true,
  },
};
