import { setMidnightUTC } from "@/lib/utils";
import axiosInstance from "../axiosInstance";

export const getAvailability = async (listingId: string) => {
  return axiosInstance.get(`/calendar/${listingId}`);
};

export const blockDates = async ({
  dates,
  listingId,
}: {
  dates: string[];
  listingId: string;
}) => {
  const sortedDates = dates
    .sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    })
    .map((date) => {
      const newDate = setMidnightUTC(date);
      return newDate;
    });

  const startDate = sortedDates[0];
  const endDate =
    sortedDates.length === 1
      ? sortedDates[0]
      : sortedDates[sortedDates.length - 1];

  const obj = {
    startDate,
    endDate,
    isBlocked: true,
  };

  console.log(obj);

  // console.log("📅 Sorted Dates:", startDate, endDate);

  return axiosInstance.patch(`/calendar/${listingId}`, obj);
};

export const unblockDates = async ({
  dates,
  listingId,
}: {
  dates: string[];
  listingId: string;
}) => {
  const sortedDates = dates
    .sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    })
    .map((date) => {
      const newDate = setMidnightUTC(date);
      return newDate;
    });

  const startDate = sortedDates[0];
  const endDate =
    sortedDates.length === 1
      ? sortedDates[0]
      : sortedDates[sortedDates.length - 1];

  const obj = {
    startDate,
    endDate,
    isBlocked: false,
  };

  return axiosInstance.patch(`/calendar/${listingId}`, obj);
};

export const setCustomPricing = async ({
  dates,
  price,
  listingId,
}: {
  dates: string[];
  price: number;
  listingId: string;
}) => {
  return axiosInstance.patch(`/calendar/${listingId}`, {
    startDate: dates[0],
    endDate: dates.length > 1 ? dates[dates.length - 1] : dates[0],
    customPrice: price,
  });
};

const calendarController = {
  getAvailability,
  blockDates,
  unblockDates,
  setCustomPricing,
};

export default calendarController;
