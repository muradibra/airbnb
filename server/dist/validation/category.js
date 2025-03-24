"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCategoryValidation = exports.createCategoryValidation = void 0;
exports.createCategoryValidation = {
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
exports.editCategoryValidation = {
    name: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    description: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    icon: {
        in: ["body"],
        optional: true,
    },
};
