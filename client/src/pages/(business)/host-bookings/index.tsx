import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import bookingService from "@/services/booking";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PenIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import queryClient from "@/config/query";
import { Booking } from "@/types";
import { toast } from "sonner";
import { queryKeys } from "@/constants/query-keys";

const HostBookingsPage = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.HOST_BOOKINGS],
    queryFn: bookingService.getHostBookings,
  });

  const { mutate: mutateUpdateStatus, isPending: isUpdateStatusPending } =
    useMutation({
      mutationFn: bookingService.updateBookingStatus,
      onSuccess: (data) => {
        if (data?.data.booking.status === "approved") {
          toast.success("Booking approved");
        } else {
          toast.success("Booking rejected");
        }

        queryClient.invalidateQueries({ queryKey: [queryKeys.HOST_BOOKINGS] });
      },
    });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-3 h-[80vh]">
        <Spinner />
        <p>loading...</p>
      </div>
    );
  }

  const bookings = data?.data.bookings;

  return (
    <div className="px-[24px]">
      <div className="flex justify-between items-center my-[32px]">
        <h1 className="text-[#222222] text-[32px] font-semibold">
          Your Bookings
        </h1>
      </div>

      <div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Listing Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Guest Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Guest Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Check-in Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Check-out Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Guest Count
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking: Booking) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <th
                    key={booking._id}
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {booking.listing.title}
                  </th>
                  <td className="px-6 py-4">{booking.guest.name}</td>
                  <td className="px-6 py-4">{booking.guest.email}</td>
                  <td className="px-6 py-4">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {booking.guestsCount?.adults +
                      booking.guestsCount?.children +
                      booking.guestsCount?.infants +
                      booking.guestsCount?.pets}
                  </td>
                  <td className="px-6 py-4">{booking.totalPrice}</td>
                  <td className={`px-6 py-4 `}>{booking.paymentStatus}</td>
                  <td
                    className={`px-6 py-4 font-bold uppercase ${
                      booking.status === "pending"
                        ? "text-yellow-400"
                        : booking.status === "approved"
                        ? "text-green-500"
                        : "text-red-500"
                    } `}
                  >
                    {booking.status}
                  </td>
                  <td className="px-6 py-4">
                    <Popover
                      open={isPopoverOpen}
                      onOpenChange={setIsPopoverOpen}
                    >
                      <PopoverTrigger asChild className="cursor-pointer">
                        <PenIcon className="w-5 h-5" />
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col w-28 p-0">
                        {booking.status === "approved" ||
                        booking.status === "rejected" ? (
                          <div className="h-7"></div>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                mutateUpdateStatus({
                                  bookingId: booking._id,
                                  status: "approved",
                                });
                                setIsPopoverOpen(false);
                              }}
                              className="bg-green-500 text-white w-full"
                            >
                              Approve
                            </Button>
                            <Button
                              variant={"destructive"}
                              className="text-white w-full"
                              onClick={() => {
                                mutateUpdateStatus({
                                  bookingId: booking._id,
                                  status: "rejected",
                                });
                                setIsPopoverOpen(false);
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostBookingsPage;
