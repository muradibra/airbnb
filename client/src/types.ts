import { AxiosError } from "axios";

export type User = {
  _id: string;
  avatar: string | null;
  name: string;
  email: string;
  wishlist: string[];
  listings: string[];
  bookings: string[];
  phoneNumber: string;
  // isBlocked?: boolean;
  createdAt: string;
  role: UserRole;
};

export type Category = {
  _id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  _id: string;
  title: string;
  description: string;
  address: {
    _id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    __v: number;
  };
  category: {
    _id: string;
    name: string;
    description: string;
    icon: string;
  };
  images: string[];
  amenities: string[];
  pricePerNight: number;
  discountedPricePerNight: number;
  maxGuestCount: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  host: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  reservations: [];
  reviews: [];
  averageRating: number;
  availability: any;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  guestsCount: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  _id: string;
  host: string;
  guest: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  listing: {
    reservations: [];
    _id: string;
    title: string;
    description: string;
    address: string;
    category: string;
    images: string[];
    amenities: string[];
    pricePerNight: number;
    discountedPricePerNight: number;
    maxGuestCount: number;
    bedroomCount: number;
    bedCount: number;
    bathroomCount: number;
    host: string;
    reviews: [];
    averageRating: number;
    availability: [];
    createdAt: "2025-03-13T12:39:44.580Z";
    updatedAt: "2025-03-13T12:39:44.581Z";
  };
  checkInDate: "2025-03-29T00:00:00.000Z";
  checkOutDate: "2025-03-31T00:00:00.000Z";
  totalPrice: number;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
};

// export type Review = {
//   author: User;
//   content: string;
//   createdAt: string;
//   id: string;
//   rate: number;
//   rent: Rent;
//   status: ReviewStatus;
//   _id: string;
// };

export enum UserRole {
  Admin = "admin",
  Guest = "guest",
  Host = "host",
}

export enum BookingStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Cancelled = "Cancelled",
}

export enum ReviewStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export type AxiosResponseError = AxiosError<{
  message: string;
}>;

export interface ImageFile {
  id: string;
  file: File | string;
  preview: string;
}

export interface SortableImageProps {
  image: ImageFile;
  removeImage: (id: string) => void;
}
