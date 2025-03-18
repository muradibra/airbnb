import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  isBefore,
} from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import calendarController from "@/services/calendar";
import { Input } from "@/components/ui/input";

export const HostCalendar = ({ listingId }: { listingId: string }) => {
  const today = new Date(); // Get today's date
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [customPrice, setCustomPrice] = useState(""); // For setting a price
  const [tooltip, setTooltip] = useState<{
    date: Date;
    content: string;
  } | null>(null);

  // Fetch availability from backend
  const { data, refetch } = useQuery({
    queryKey: ["calendar", listingId],
    queryFn: async () => calendarController.getAvailability(listingId),
  });

  const availability = data?.data?.availability;

  // Extract blocked, booked, and custom-priced dates
  const blockedDates =
    availability
      ?.filter((d: any) => d.isBlocked)
      .map((d: any) => new Date(d.date)) || [];
  const bookedDates =
    availability
      ?.filter((d: any) => d.isBooked)
      .map((d: any) => new Date(d.date)) || [];
  const customPriceDates =
    availability
      ?.filter((d: any) => d.customPrice)
      .map((d: any) => ({ date: new Date(d.date), price: d.customPrice })) ||
    [];
  const minimumStayDates =
    availability
      ?.filter((d: any) => d.minimumStay && d.minimumStay > 1)
      .map((d: any) => ({ date: new Date(d.date), minStay: d.minimumStay })) ||
    [];

  // Generate all 12 months dynamically
  const months = Array.from({ length: 12 }, (_, i) => addMonths(today, i));

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return; // Prevent selection of past dates

    setSelectedDates((prevDates) => {
      const exists = prevDates.some((d) => isSameDay(d, date));
      return exists
        ? prevDates.filter((d) => !isSameDay(d, date))
        : [...prevDates, date];
    });
  };

  // Block Dates Mutation
  const blockDatesMutation = useMutation({
    mutationFn: calendarController.blockDates,
    onSuccess: () => {
      toast.success("Dates blocked successfully!");
      refetch();
      setSelectedDates([]);
    },
    onError: () => toast.error("Failed to block dates"),
  });

  // Unblock Dates Mutation
  const unblockDatesMutation = useMutation({
    mutationFn: calendarController.unblockDates,
    onSuccess: () => {
      toast.success("Dates unblocked successfully!");
      refetch();
      setSelectedDates([]);
    },
    onError: () => toast.error("Failed to unblock dates"),
  });

  const setCustomPriceMutation = useMutation({
    mutationFn: calendarController.setCustomPricing,
    onSuccess: () => {
      toast.success("Custom pricing applied!");
      refetch();
      setSelectedDates([]);
      setCustomPrice("");
    },
    onError: () => toast.error("Failed to set custom pricing"),
  });

  // Convert selected dates to API format (yyyy-MM-dd)
  const formattedSelectedDates = selectedDates.map((date) =>
    format(date, "yyyy-MM-dd")
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Manage Availability
      </h2>

      {/* Scrollable Yearly Calendar */}
      <div className="overflow-y-auto h-[600px] border p-4 space-y-6 max-w-full">
        {months.map((month) => {
          const firstDayOfMonth = startOfMonth(month);
          const lastDayOfMonth = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({
            start: firstDayOfMonth,
            end: lastDayOfMonth,
          });

          return (
            <div key={month.toISOString()} className="border-b pb-4">
              <h3 className="text-lg font-bold mb-2 text-center">
                {format(month, "MMMM yyyy")}
              </h3>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
                {daysInMonth.map((day) => {
                  const isBlocked = blockedDates.some((blockedDate: Date) =>
                    isSameDay(blockedDate, day)
                  );
                  const isBooked = bookedDates.some((bookedDate: Date) =>
                    isSameDay(bookedDate, day)
                  );
                  const customPriceEntry = customPriceDates.find(
                    (entry: { date: Date; price: number }) =>
                      isSameDay(entry.date, day)
                  );
                  const minStayEntry = minimumStayDates.find(
                    (entry: { date: Date; price: number }) =>
                      isSameDay(entry.date, day)
                  );
                  const isSelected = selectedDates.some((selectedDate) =>
                    isSameDay(selectedDate, day)
                  );
                  const isPastDate = isBefore(day, today);

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() =>
                        setTooltip({
                          date: day,
                          content: `${isBlocked ? "Blocked" : ""} 
                                    ${isBooked ? "Booked" : ""} 
                                    ${
                                      customPriceEntry
                                        ? `Price: $${customPriceEntry.price}`
                                        : ""
                                    } 
                                    ${
                                      minStayEntry
                                        ? `Min Stay: ${minStayEntry.minStay} days`
                                        : ""
                                    }`,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md cursor-pointer text-xs sm:text-sm transition
                        ${
                          isPastDate
                            ? "text-gray-400 cursor-not-allowed opacity-50"
                            : ""
                        }
                        ${
                          isBlocked
                            ? "bg-red-700 text-white border-4 border-red-700 "
                            : ""
                        }
                        ${isBooked ? "bg-gray-400 text-white" : ""}
                        ${customPriceEntry ? "bg-yellow-500 text-black" : ""}
                        ${minStayEntry ? "border-2 border-purple-500" : ""}
                        ${isSelected ? "bg-blue-500 text-white" : ""}
                        hover:bg-gray-300`}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip Display */}
      {tooltip && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg">
          {tooltip.content || "Available"}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() =>
            unblockDatesMutation.mutate({
              dates: formattedSelectedDates,
              listingId,
            })
          }
          disabled={selectedDates.length === 0}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
        >
          Unblock Selected Dates
        </Button>

        {/* Custom Pricing Input */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            type="number"
            placeholder="Set Custom Price"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="w-full sm:w-40"
          />
          <Button
            onClick={() =>
              setCustomPriceMutation.mutate({
                dates: formattedSelectedDates,
                price: Number(customPrice),
                listingId,
              })
            }
            disabled={selectedDates.length === 0 || !customPrice}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Apply Price
          </Button>
        </div>

        <Button
          onClick={() =>
            blockDatesMutation.mutate({
              dates: formattedSelectedDates,
              listingId,
            })
          }
          disabled={selectedDates.length === 0}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
        >
          Block Selected Dates
        </Button>
      </div>
    </div>
  );
};
