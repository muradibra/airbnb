import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PenIcon } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

import { Booking } from "@/types";
import { queryKeys } from "@/constants/query-keys";

import bookingService from "@/services/booking";
import queryClient from "@/config/query";
import { format } from "date-fns";

const HostBookingsPage = () => {
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
                <th scope="col" className="px-6 py-3 text-center">
                  Guest Name
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Guest Email
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Check-in Date
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Check-out Date
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Guest Count
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Total Price
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking: Booking) => (
                <tr
                  key={booking._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {booking.listing.title}
                  </th>
                  <td className="px-6 py-4 text-center">
                    {booking.guest.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {booking.guest.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {format(new Date(booking.checkInDate), "dd/MM/yyyy")}
                    {/* {new Date(booking.checkInDate).toLocaleDateString()} */}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {format(new Date(booking.checkOutDate), "dd/MM/yyyy")}
                    {/* {new Date(booking.checkOutDate).toLocaleDateString()} */}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {booking.guestsCount?.adults +
                      booking.guestsCount?.children +
                      booking.guestsCount?.infants +
                      booking.guestsCount?.pets}
                  </td>
                  <td className="px-6 py-4 text-center">
                    ${booking.totalPrice}
                  </td>
                  <td className={`px-6 py-4 text-center`}>
                    {booking.paymentStatus}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold uppercase text-center ${
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
                    <Popover>
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
                              disabled={isUpdateStatusPending}
                              onClick={() => {
                                mutateUpdateStatus({
                                  bookingId: booking._id,
                                  status: "approved",
                                });
                              }}
                              className="bg-green-500 text-white w-full"
                            >
                              Approve
                            </Button>
                            <Button
                              variant={"destructive"}
                              disabled={isUpdateStatusPending}
                              className="text-white w-full"
                              onClick={() => {
                                mutateUpdateStatus({
                                  bookingId: booking._id,
                                  status: "rejected",
                                });
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
