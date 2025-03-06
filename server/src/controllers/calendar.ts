import { Request, Response } from "express";
import Calendar from "../mongoose/schemas/calendar";
import Listing from "../mongoose/schemas/listing";
import { startOfDay, endOfDay, eachDayOfInterval } from "date-fns";

const getAvailability = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.query;

    const calendar = await Calendar.findOne({ listing: listingId });

    if (!calendar) {
      res.status(404).json({ message: "Calendar not found" });
      return;
    }

    // Filter dates within the requested range
    const availabilityInRange = calendar.dates.filter(
      (date) =>
        date.date >= new Date(startDate as string) &&
        date.date <= new Date(endDate as string)
    );

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
    const { startDate, endDate, isBlocked, customPrice, minimumStay, note } =
      req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: userId });
    if (!listing) {
      res.status(403).json({ message: "Unauthorized or listing not found" });
      return;
    }

    // Get all dates in range
    const datesInRange = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });

    // Find or create calendar
    let calendar = await Calendar.findOne({ listing: listingId });
    if (!calendar) {
      calendar = new Calendar({ listing: listingId, dates: [] });
    }

    // Update each date in range
    for (const date of datesInRange) {
      const existingDateIndex = calendar.dates.findIndex(
        (d) => d.date.getTime() === startOfDay(date).getTime()
      );

      const dateData = {
        date: startOfDay(date),
        isBlocked: isBlocked ?? false,
        customPrice: customPrice || null,
        minimumStay: minimumStay || calendar.defaultMinimumStay,
        note: note || "",
      };
      if (existingDateIndex >= 0) {
        Object.assign(calendar.dates[existingDateIndex], dateData);
      } else {
        calendar.dates.push(dateData);
      }
    }

    calendar.updatedAt = new Date();
    await calendar.save();

    res.status(200).json({
      message: "Calendar updated successfully",
      calendar,
    });
  } catch (err) {
    console.error(err);
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
