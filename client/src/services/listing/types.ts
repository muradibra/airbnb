export type GetHostListings = {
  message: string;
  listings: Listing[];
};

export type Listing = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  address: {
    country: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  bedroomCount: number;
  category: string;
  bedCount: number;
  guestCount: number;
  price: number;
  host: string;
  createdAt: string;
};

export type CreateListing = {
  message: string;
  listing: Listing;
};

export type CreateListingData = {
  title: string;
  description: string;
  category: string;
  address: {
    country: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  amenities: string[];
  conditions: {
    maxGuestCount: number;
    bedroomCount: number;
    bedCount: number;
    bathroomCount: number;
  };
  pricePerNight: number;
  images: string[];
};

// export type EditListingData = {
//   title?: string;
//   description?: string;
//   category?: string;
//   address: {
//     country: string;
//     street: string;
//     city?: string;
//     state?: string;
//     zip?: string;
//   };
//   amenities?: string[];
//   conditions?: {
//     maxGuestCount?: number;
//     bedroomCount?: number;
//     bedCount?: number;
//     bathroomCount?: number;
//   };
//   pricePerNight?: number;
//   images?: string[];
// };
