"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const listingSchema = new mongoose_1.Schema({
    title: {
        type: String,
        maxLength: 75,
        required: true,
    },
    description: {
        type: String,
        maxLength: 1500,
        required: true,
    },
    address: {
        type: mongoose_1.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    images: [{ type: String, required: true }],
    amenities: [{ type: String }],
    pricePerNight: {
        type: Number,
        required: true,
    },
    discountedPricePerNight: {
        type: Number,
        required: false,
    },
    maxGuestCount: {
        type: Number,
        required: true,
    },
    bedroomCount: {
        type: Number,
        required: true,
    },
    bedCount: {
        type: Number,
        required: true,
    },
    bathroomCount: {
        type: Number,
        required: true,
    },
    host: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    availability: [
        {
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        },
    ],
    reservations: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "Booking",
        },
    ],
    reviews: {
        type: [mongoose_1.Types.ObjectId],
        ref: "Review",
        // required: false,
    },
    // ratings: [
    //   {
    //     user: {
    //       type: Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     rating: {
    //       type: Number,
    //       required: true,
    //     },
    //     comment: {
    //       type: String,
    //       maxLength: 500,
    //       required: false,
    //     },
    //     createdAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //     updatedAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    averageRating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Listing = mongoose_1.default.model("Listing", listingSchema);
exports.default = Listing;
