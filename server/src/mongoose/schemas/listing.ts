import mongoose, { Schema, Types } from "mongoose";

const listingSchema = new Schema({
  title: {
    type: String,
    maxLength: 75,
    required: true,
  },
  description: {
    type: String,
    maxLength: 500,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  categories: [
    {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  images: [{ type: String, required: true }],
  ameneties: [{ type: String }],
  pricePerNight: {
    type: Number,
    required: true,
  },
  discountedPricePerNight: {
    type: Number,
    required: false,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  guestRestrictions: {
    maxAdults: {
      type: Number,
      required: true,
    },
    maxChildren: {
      type: Number,
      required: true,
    },
    maxInfants: {
      type: Number,
      required: true,
    },
    maxPets: {
      type: Number,
      required: true,
    },
  },
  host: {
    type: Types.ObjectId,
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
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      renter: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  ratings: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        maxLength: 500,
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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

const Listing = mongoose.model("listing", listingSchema);

export default Listing;
