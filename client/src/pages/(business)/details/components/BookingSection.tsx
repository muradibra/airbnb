import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import { useNavigate } from "react-router-dom";
import { paths } from "@/constants/paths";
import { Listing } from "@/types";
import { setCurrentBooking } from "@/store/booking/bookingSlice";

interface BookingSectionProps {
  listingId: string;
  listing: Listing;
  listingCalendar?: {
    dates: Array<{
      date: string;
      isBooked: boolean;
      isBlocked: boolean;
      customPrice: number | null;
    }>;
  };
}

const BookingSection = ({
  listing,
  listingCalendar,
  listingId,
}: BookingSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);
  const { openDialog } = useDialog();
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const totalGuests =
    guestCount.adults +
    guestCount.children +
    guestCount.infants +
    guestCount.pets;
  const nights =
    dateRange.startDate && dateRange.endDate
      ? differenceInDays(dateRange.endDate, dateRange.startDate)
      : 0;

  // Convert calendar dates to disabled dates for the date picker
  const disabledDates =
    listingCalendar?.dates
      .filter((date) => date.isBooked || date.isBlocked)
      .map((date) => new Date(date.date)) || [];

  // Get custom prices for dates
  const customPrices = new Map(
    listingCalendar?.dates
      .filter((date) => date.customPrice !== null)
      .map((date) => [
        format(new Date(date.date), "yyyy-MM-dd"),
        date.customPrice,
      ]) || []
  );

  // Calculate price based on custom prices if available
  const calculateTotalPrice = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;

    let total = 0;
    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    while (currentDate < endDate) {
      const dateString = format(currentDate, "yyyy-MM-dd");
      const customPrice = customPrices.get(dateString);
      total += customPrice || listing.pricePerNight;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return total;
  };

  const totalPrice = calculateTotalPrice();

  const handleBooking = () => {
    if (!user) {
      openDialog(DialogTypeEnum.LOGIN);
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    dispatch(
      setCurrentBooking({
        listingId,
        listing: listing,
        checkInDate: dateRange.startDate.toISOString(),
        checkOutDate: dateRange.endDate.toISOString(),
        totalPrice,
        guestCount,
        createdAt: new Date().toISOString(),
      })
    );

    navigate(paths.PAYMENT(listingId));
  };

  return (
    <div className="sticky top-30 w-full p-6 border rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-2xl font-semibold">
            ${listing.pricePerNight}
          </span>
          <span className="text-gray-600"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm underline">2 reviews</span>
        </div>
      </div>

      {/* Date Selection */}
      <Popover>
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal mb-6"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.startDate && dateRange.endDate ? (
              <span>
                {format(dateRange.startDate, "MMM dd")} -{" "}
                {format(dateRange.endDate, "MMM dd")}
              </span>
            ) : (
              "Select dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[99999] w-auto p-0">
          <DateRange
            ranges={[dateRange]}
            onChange={(item) => setDateRange(item.selection)}
            months={1}
            direction="vertical"
            minDate={new Date()}
            disabledDates={disabledDates}
            rangeColors={["#FF385C"]}
            showDateDisplay={false}
            dayContentRenderer={(date) => {
              const dateString = format(date, "yyyy-MM-dd");
              const customPrice = customPrices.get(dateString);
              return customPrice ? (
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  <span className="text-xs text-[#FF385C]">${customPrice}</span>
                </div>
              ) : null;
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Guest Count */}
      <Popover>
        <PopoverTrigger className="w-full">
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal mb-6"
          >
            <Users className="mr-2 h-4 w-4" />
            {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Adults</p>
                <p className="text-sm text-gray-600">Ages 13 or above</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      adults: Math.max(1, prev.adults - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{guestCount.adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      adults: Math.min(listing.maxGuestCount, prev.adults + 1),
                    }))
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Children</p>
                <p className="text-sm text-gray-600">Ages 0 to 12</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      children: Math.max(0, prev.children - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{guestCount.children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      children: Math.min(
                        listing.maxGuestCount - totalGuests,
                        prev.children + 1
                      ),
                    }))
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Infants</p>
                <p className="text-sm text-gray-600">Under 2 years</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      infants: Math.max(0, prev.infants - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{guestCount.infants}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      infants: Math.min(5, prev.infants + 1),
                    }))
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Pets</p>
                <p className="text-sm text-gray-600">
                  Bringing an assistance animal?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      pets: Math.max(0, prev.pets - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{guestCount.pets}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestCount((prev) => ({
                      ...prev,
                      pets: Math.min(5, prev.pets + 1),
                    }))
                  }
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>
            ${listing.pricePerNight} x {nights} nights
            {customPrices.size > 0 && " (some dates have custom prices)"}
          </span>
          <span>${totalPrice}</span>
        </div>
        {/* <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>$0</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>$0</span>
        </div> */}
        <div className="flex justify-between font-semibold text-lg pt-4 border-t">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      {/* Book Button */}
      <Button
        className="w-full bg-[#FF385C] hover:bg-[#FF385C]/90"
        onClick={handleBooking}
        disabled={!dateRange.startDate || !dateRange.endDate}
      >
        Reserve
      </Button>
    </div>
  );
};

export default BookingSection;
