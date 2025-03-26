import { Spinner } from "@/components/shared/Spinner";
import { StarIcon } from "lucide-react";

type Props = {
  booking: {
    listing: {
      _id: string;
      title: string;
      images: string[];
      pricePerNight: number;
      averageRating: number;
      // reviewCount: number;
    };
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    guestCount: {
      adults: number;
      children: number;
      infants: number;
      pets: number;
    };
  };
};

export const PaymentSummary = ({ booking }: Props) => {
  if (!booking)
    return (
      <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  const { listing, checkInDate, checkOutDate, totalPrice, guestCount } =
    booking;
  const mainImage = listing.images[0];
  const totalGuests =
    guestCount.adults +
    guestCount.children +
    guestCount.infants +
    guestCount.pets;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 h-fit lg:sticky top-24">
      <h3 className="text-xl font-semibold text-gray-900">Booking Summary</h3>
      <p className="text-gray-500 text-sm mt-1 mb-6">Your stay details</p>

      <div className="flex gap-4">
        <img
          src={mainImage}
          alt="Listing"
          className="w-32 h-24 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {listing.title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-[#FF385C]" />
            <span className="text-sm text-gray-600">
              {listing.averageRating.toFixed(2)} (440 reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Check-in</span>
          <span className="font-medium">
            {new Date(checkInDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Check-out</span>
          <span className="font-medium">
            {new Date(checkOutDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">{totalGuests} guests</span>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Price</span>
          <span className="text-xl font-semibold">${totalPrice}</span>
        </div>
        <p className="text-sm text-gray-500">Includes taxes and fees</p>
      </div>
    </div>
  );
};
