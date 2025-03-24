"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserSchema = void 0;
exports.editUserSchema = {
    avatar: {
        in: ["body"],
        custom: {
            options: (value) => {
                if (value) {
                    return typeof value === "string";
                }
                return true;
            },
        },
        optional: true,
    },
    name: {
        in: ["body"],
        custom: {
            options: (value) => {
                if (value) {
                    return typeof value === "string";
                }
                return true;
            },
        },
    },
    password: {
        in: ["body"],
        isString: true,
        isLength: {
            options: { min: 2, max: 50 },
        },
        optional: true,
    },
};
