import { Request, Response } from "express";
import Calendar from "../mongoose/schemas/calendar";
import Listing from "../mongoose/schemas/listing";
import { isBefore, addDays } from "date-fns";
// import fs from "fs";

// const LOG_FILE = "availability_logs.txt";

// const logToFile = (message: string) => {
//   fs.appendFileSync(LOG_FILE, message + "\n", { encoding: "utf8" });
// };

const setMidnightUTC = (date: Date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const fixedDate = new Date(
    Date.UTC(
      date.getFullYear(), // Get the full year in local time
      date.getMonth(), // Get the month in local time
      date.getDate(), // Get the day in local time
      0,
      0,
      0,
      0 // Set the time to 00:00:00 UTC
    )
  );

  console.log("⏳ Fixed Date:", fixedDate.toISOString());

  return fixedDate;
};

const getAvailability = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.query;

    const calendar = await Calendar.findOne({ listing: listingId });

    if (!calendar) {
      res.status(404).json({ message: "Calendar not found" });
      return;
    }

    console.log("📅 Calendar:", calendar);

    // Filter dates within the requested range
    const availabilityInRange =
      startDate || endDate
        ? calendar.dates.filter(
            (date) =>
              date.date >= new Date(startDate as string) &&
              date.date <= new Date(endDate as string)
          )
        : calendar.dates;

    res.status(200).json({
      message: "Availability fetched successfully",
      availability: availabilityInRange,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { listingId } = req.params;
    let { startDate, endDate, isBlocked, customPrice, minimumStay, note } =
      req.body;

    const sanitizedStartDate = setMidnightUTC(new Date(startDate));
    let sanitizedEndDate = endDate ? setMidnightUTC(new Date(endDate)) : null;
    let isBlockingSingleDay = false;

    // If no endDate is provided, treat it as a single-day selection and set endDate as startDate
    if (!sanitizedEndDate) {
      sanitizedEndDate = sanitizedStartDate;
      isBlockingSingleDay = true;
    }

    if (
      isBefore(sanitizedEndDate, sanitizedStartDate) &&
      !isBlockingSingleDay
    ) {
      res.status(400).json({ message: "End date cannot be before start date" });
      return;
    }

    let datesInRange: Date[] = [];
    let currentDate = new Date(sanitizedStartDate);

    while (currentDate <= sanitizedEndDate) {
      datesInRange.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    let calendar = await Calendar.findOne({ listing: listingId });
    if (!calendar) {
      calendar = new Calendar({ listing: listingId, dates: [] });
    }

    for (const date of datesInRange) {
      const fixedDate = setMidnightUTC(date);

      const existingDateIndex = calendar.dates.findIndex(
        (d) => d.date.getTime() === fixedDate.getTime()
      );

      if (existingDateIndex >= 0) {
        const existingDate = calendar.dates[existingDateIndex];
        const dateData = {
          date: fixedDate,
          isBlocked:
            isBlocked !== undefined ? isBlocked : existingDate.isBlocked,
          customPrice:
            customPrice !== undefined ? customPrice : existingDate.customPrice,
          minimumStay:
            minimumStay !== undefined ? minimumStay : existingDate.minimumStay,
          note: note !== undefined ? note : existingDate.note,
        };
        Object.assign(calendar.dates[existingDateIndex], {
          ...dateData,
          isBooked: false,
        });
      } else {
        const dateData = {
          date: fixedDate,
          isBlocked: isBlocked ?? false,
          customPrice: customPrice || null,
          minimumStay: minimumStay || calendar.defaultMinimumStay,
          note: note || "",
        };
        calendar.dates.push({ ...dateData, isBooked: false });
      }
    }

    calendar.updatedAt = new Date();
    await calendar.save();

    res.status(200).json({
      message: "Calendar updated successfully",
      calendar,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const blockDates = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { listingId } = req.params;
    const { startDate, endDate, note } = req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: userId });
    console.log("----listing----", listing);

    if (!listing) {
      res.status(403).json({ message: "Unauthorized or listing not found" });
      return;
    }

    // Update availability with blocked dates
    const result = await updateAvailability(
      {
        ...req,
        body: {
          startDate,
          endDate,
          isBlocked: true,
          note,
        },
      } as Request,
      res
    );

    return result;
    // res.status(200).json({ message: "Blocked dates successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setCustomPricing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { listingId } = req.params;
    const { startDate, endDate, price, note } = req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: userId });
    if (!listing) {
      res.status(403).json({ message: "Unauthorized or listing not found" });
      return;
    }

    // Update availability with custom pricing
    const result = await updateAvailability(
      {
        ...req,
        body: {
          startDate,
          endDate,
          customPrice: price,
          note,
        },
      } as Request,
      res
    );

    return result;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setMinimumStay = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { listingId } = req.params;
    const { defaultMinimumStay } = req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: userId });
    if (!listing) {
      res.status(403).json({ message: "Unauthorized or listing not found" });
      return;
    }

    let calendar = await Calendar.findOne({ listing: listingId });
    if (!calendar) {
      calendar = new Calendar({ listing: listingId, dates: [] });
    }

    calendar.defaultMinimumStay = defaultMinimumStay;
    calendar.updatedAt = new Date();
    await calendar.save();

    res.status(200).json({
      message: "Minimum stay updated successfully",
      calendar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const calendarController = {
  getAvailability,
  updateAvailability,
  blockDates,
  setCustomPricing,
  setMinimumStay,
};

export default calendarController;
