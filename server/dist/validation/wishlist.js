"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWishlistSchema = exports.createWishlistSchema = void 0;
exports.createWishlistSchema = {
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
exports.updateWishlistSchema = {
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
