import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GuestsStepProps {
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  onChange: (guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }) => void;
  onBack: () => void;
  onSearch: () => void;
}

export const GuestsStep = ({
  guests,
  onChange,
  onBack,
  onSearch,
}: GuestsStepProps) => {
  const [guestCounts, setGuestCounts] = useState(guests);

  // Calculate total guests excluding infants and pets
  // const totalGuests = guestCounts.adults + guestCounts.children;
  const maxTotalGuests = 16;

  const updateCount = (type: keyof typeof guests, value: number) => {
    const newCounts = { ...guestCounts, [type]: value };

    // If adults are set to 0, reset children count to 0 as well
    if (type === "adults" && value === 0) {
      newCounts.children = 0;
    }

    // For all cases, check total guest limit
    if (type === "adults" || type === "children") {
      const newTotal =
        (type === "adults" ? value : guestCounts.adults) +
        (type === "children" ? value : guestCounts.children);
      if (newTotal > maxTotalGuests) return;
    }

    setGuestCounts(newCounts);

    // If adults are 0, don't send guest counts in the search params
    if (newCounts.adults === 0) {
      onChange({
        adults: 0,
        children: 0,
        infants: guestCounts.infants,
        pets: guestCounts.pets,
      });
    } else {
      onChange(newCounts);
    }
  };

  const GuestCounter = ({
    type,
    label,
    description,
    min = 0,
    max,
  }: {
    type: keyof typeof guests;
    label: string;
    description: string;
    min?: number;
    max?: number;
  }) => {
    // Calculate remaining spots for this type
    const getRemainingSpots = () => {
      if (type === "infants" || type === "pets") return max || 5;
      if (guestCounts.adults === 16) return Infinity; // No limit when adults is 16
      return (
        maxTotalGuests -
        (type === "adults" ? guestCounts.children : guestCounts.adults)
      );
    };

    const currentMax = Math.min(max || 16, getRemainingSpots());

    return (
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              updateCount(type, Math.max(min, guestCounts[type] - 1))
            }
            disabled={guestCounts[type] <= min}
          >
            -
          </Button>
          <span className="w-6 text-center">{guestCounts[type]}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              updateCount(type, Math.min(currentMax, guestCounts[type] + 1))
            }
            disabled={guestCounts[type] >= currentMax}
          >
            +
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Who's coming?</h2>
      <div className="divide-y">
        <GuestCounter
          type="adults"
          label="Adults"
          description="Ages 13 or above"
          min={0} // Allow adults to be set to 0
          max={16}
        />
        <GuestCounter
          type="children"
          label="Children"
          description="Ages 2-12"
          max={guestCounts.adults === 16 ? undefined : 15}
        />
        <GuestCounter
          type="infants"
          label="Infants"
          description="Under 2"
          max={5}
        />
        <GuestCounter
          type="pets"
          label="Pets"
          description="Service animals welcome"
          max={5}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onSearch}
          className="bg-[#FF385C] hover:bg-[#FF385C]/90"
        >
          Search
        </Button>
      </div>
      <p className="text-sm text-gray-500 text-center">
        All fields are optional. Click Search to see all available listings.
      </p>
    </div>
  );
};
