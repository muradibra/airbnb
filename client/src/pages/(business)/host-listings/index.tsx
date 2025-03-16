import { MultiStepForm } from "@/components/shared/MultiStepForm";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
// import { paths } from "@/constants/paths";
import { queryKeys } from "@/constants/query-keys";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import listingService from "@/services/listing";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const HostListingsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.HOST_LISTINGS],
    queryFn: listingService.getHostListings,
  });
  // const navigate = useNavigate();

  const { openDialog, type } = useDialog();
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const hostListings = data?.data.listings;

  return (
    <div className="px-[24px]">
      <div className="flex justify-between items-center my-[32px]">
        <h1 className="text-[#222222] text-[32px] font-semibold">
          Your listings
        </h1>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full cursor-pointer"
          onClick={() => {
            setActiveListingId(null);
            openDialog(DialogTypeEnum.CREATE_LISTING);
          }}
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>

      <div className="listings">
        {isLoading && (
          <div className="min-h-[80vh] flex justify-center items-center">
            <Spinner />
          </div>
        )}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-y-4">
          {hostListings?.map((listing) => (
            <div
              key={listing._id}
              className="listing-card sm:w-[45%] md:w-[30%]"
            >
              <div className="w-full h-[200px] relative">
                <img
                  src={listing.images[0]}
                  alt="listing"
                  className="w-full h-full object-cover rounded bg-gray-400"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={() => {
                      setActiveListingId(listing._id);
                      openDialog(DialogTypeEnum.EDIT_LISTING);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <h2 className="text-[#222222] text-lg font-semibold">
                  {listing.title}
                </h2>
                <p className="text-[#4b5563] text-sm">
                  {listing.address.city}, {listing.address.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MultiStepForm
        type={type || DialogTypeEnum.CREATE_LISTING}
        listingId={activeListingId || undefined}
      />
    </div>
  );
};

export default HostListingsPage;
