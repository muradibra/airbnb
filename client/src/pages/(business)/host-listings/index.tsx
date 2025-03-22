import { MultiStepForm } from "@/components/shared/MultiStepForm";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import queryClient from "@/config/query";
// import { paths } from "@/constants/paths";
import { queryKeys } from "@/constants/query-keys";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import listingService from "@/services/listing";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PenIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HostListingsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.HOST_LISTINGS],
    queryFn: listingService.getHostListings,
  });
  const searchParams = new URLSearchParams(window.location.search);
  const isCreateListing = searchParams.get("createListing") === "true";
  // console.log("isCreateListing:", isCreateListing);

  const { openDialog, type } = useDialog();
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  useEffect(() => {
    if (isCreateListing) {
      openDialog(DialogTypeEnum.CREATE_LISTING);
    }
  }, [isCreateListing]);

  const hostListings = data?.data.listings;

  const { mutate: removeListingMutate } = useMutation({
    mutationFn: listingService.removeListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.HOST_LISTINGS] });
    },
  });

  const removeListing = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeListingMutate(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your listing has been deleted.",
          icon: "success",
        });
      }
    });
  };

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
                <div className="absolute top-2 right-2 flex items-center gap-2 ">
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    className="cursor-pointer"
                    onClick={() => {
                      setActiveListingId(listing._id);
                      openDialog(DialogTypeEnum.EDIT_LISTING);
                    }}
                  >
                    <PenIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="cursor-pointer"
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => removeListing(listing._id)}
                  >
                    <Trash2Icon className="w-4 h-4" />
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
