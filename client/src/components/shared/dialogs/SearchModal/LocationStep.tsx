import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";

interface Location {
  _id: {
    locationId: string;
    city: string;
    state?: string;
    country: string;
  };
  address: string;
  locationId: string;
  city: string;
  state: string;
  country: string;
  listingCount: number;
  displayName: string;
}

interface LocationStepProps {
  value: { id: string; displayName: string };
  onChange: (location: { id: string; displayName: string }) => void;
  onNext: () => void;
}

export const LocationStep = ({
  value,
  onChange,
  onNext,
}: LocationStepProps) => {
  const [inputValue, setInputValue] = useState(value.displayName || "");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(inputValue, 300);

  console.log("debouncedSearch", debouncedSearch);

  useEffect(() => {
    const searchLocations = async () => {
      if (debouncedSearch.trim().length < 2) {
        setLocations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get(
          `/location/search?query=${debouncedSearch}`
        );

        setLocations(data.locations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search locations"
        );
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchLocations();
  }, [debouncedSearch]);

  const handleLocationSelect = (location: Location) => {
    setInputValue(location.displayName);
    onChange({
      id: location.locationId,
      displayName: location.displayName,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Where do you want to go?</h2>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search destinations"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Search Results */}
      {locations.length > 0 && (
        <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
          {locations.map((location) => (
            <button
              key={location.locationId}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
              onClick={() => {
                console.log("location in location step button", location);

                handleLocationSelect(location);
              }}
            >
              <Search className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{location.displayName}</p>
                <p className="text-sm text-gray-500">
                  {location.listingCount}{" "}
                  {location.listingCount === 1 ? "listing" : "listings"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popular Locations */}
      {/* {!locations.length && !isLoading && popularLocations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Popular destinations
          </h3>
          <div className="space-y-2">
            {popularLocations.map((location, index) => (
              <button
                key={index}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                onClick={() => handleLocationSelect(location.displayName)}
              >
                <Search className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{location.displayName}</p>
                  <p className="text-sm text-gray-500">
                    {location.listingCount}{" "}
                    {location.listingCount === 1 ? "listing" : "listings"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )} */}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={onNext}
          className="bg-[#FF385C] hover:bg-[#FF385C]/90 w-full"
        >
          {inputValue ? "Next" : "Skip"}
        </Button>
      </div>
    </div>
  );
};
