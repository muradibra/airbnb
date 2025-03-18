import { useQuery } from "@tanstack/react-query";
import { HostCalendar } from "./components/Calendar";
import listingService from "@/services/listing";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HostCalendarPage = () => {
  const {
    data: listings,
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["calendar"],
    queryFn: listingService.getHostListings,
  });
  const listingsData = listings?.data?.listings;

  const [selectedListingId, setSelectedListingId] = useState(
    (listingsData && listingsData[0]?._id) || ""
  );

  return (
    <div className="px-[24px]">
      <div className="flex justify-between items-center my-[32px]">
        <h1 className="text-[#222222] text-[32px] font-semibold">Calendar</h1>
      </div>

      <div className="mb-4 flex items-center gap-x-4">
        <label htmlFor="listing-select" className="mr-2">
          Select Listing:
        </label>
        <Select value={selectedListingId} onValueChange={setSelectedListingId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a listing" />
          </SelectTrigger>
          <SelectContent>
            {listingsData?.map((listing) => (
              <SelectItem key={listing._id} value={listing._id}>
                {listing.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <select
          id="listing-select"
          value={selectedListingId}
          onChange={(e) => {
            setSelectedListingId(e.target.value);
            refetch();
          }}
          className="p-2 border rounded"
        >
          {listingsData?.map((listing) => (
            <option key={listing._id} value={listing._id}>
              {listing.title}
            </option>
          ))}
        </select> */}
      </div>

      {selectedListingId && <HostCalendar listingId={selectedListingId} />}
    </div>
  );
};

export default HostCalendarPage;
