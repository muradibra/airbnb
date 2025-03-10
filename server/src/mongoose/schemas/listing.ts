import mongoose, { Schema, Types, Document } from "mongoose";

interface IListing extends Document {
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
  };
  category: Types.ObjectId;
  images: string[];
  amenities: string[];
  pricePerNight: number;
  discountedPricePerNight?: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  maxGuestCount: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  host: Types.ObjectId;
  availability: [
    {
      startDate: Date;
      endDate: Date;
    }
  ];
  reservations: Types.ObjectId;
  reviews: Types.ObjectId[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema({
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
    type: Types.ObjectId,
    ref: "Location",
    required: true,
  },
  // address: {
  //   street: {
  //     type: String,
  //     required: true,
  //   },
  //   city: {
  //     type: String,
  //     required: true,
  //   },
  //   state: {
  //     type: String,
  //   },
  //   country: {
  //     type: String,
  //     required: true,
  //   },
  //   // zipCode: {
  //   //   type: String,
  //   // },
  // },
  category: {
    type: Types.ObjectId,
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
  maxGuestCount: {
    adults: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      required: true,
    },
    infants: {
      type: Number,
      required: true,
    },
    pets: {
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
  reservations: {
    type: Types.ObjectId,
    ref: "Booking",
    // {
    //   startDate: {
    //     type: Date,
    //     required: true,
    //   },
    //   endDate: {
    //     type: Date,
    //     required: true,
    //   },
    //   renter: {
    //     type: Types.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
    // },
  },
  reviews: {
    type: [Types.ObjectId],
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

const Listing = mongoose.model<IListing>("Listing", listingSchema);

export default Listing;
