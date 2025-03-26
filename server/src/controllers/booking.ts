import { Request, Response } from "express";
import Booking from "../mongoose/schemas/booking";
import Listing from "../mongoose/schemas/listing";
import Calendar from "../mongoose/schemas/calendar";
import User from "../mongoose/schemas/user";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const {
      listingId,
      checkInDate,
      checkOutDate,
      totalPrice,
      guestCount,
      paymentStatus,
    } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    const booking = await Booking.create({
      host: listing.host,
      listing: listingId,
      guest: userId,
      checkInDate,
      checkOutDate,
      totalPrice,
      guestCount,
      paymentStatus,
      status: "pending",
    });

    res.status(201).json({ message: "Booking request created", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHostBookings = async (req: Request, res: Response) => {
  try {
    const hostId = req.user?._id;
    const listings = await Listing.find({ host: hostId });
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing")
      .populate("guest", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Bookings fetched", bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const hostId = req.user?._id;
    const { bookingId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    const booking = await Booking.findById(bookingId)
      .populate("listing host")
      .select("-__v");

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if ((booking.listing as any).host.toString() !== hostId!.toString()) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    booking.status = status;
    await booking.save();

    // If approved, update calendar dates as booked
    if (status === "approved") {
      let calendar = await Calendar.findOne({ listing: booking.listing._id });
      if (!calendar) {
        calendar = new Calendar({ listing: booking.listing._id, dates: [] });
      }

      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const datesToBook: Date[] = [];

      for (
        let d = new Date(checkIn);
        d <= checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        datesToBook.push(new Date(d));
      }

      datesToBook.forEach((day) => {
        const existing = calendar.dates.find(
          (entry) => new Date(entry.date).getTime() === new Date(day).getTime()
        );
        if (existing) {
          existing.isBooked = true;
        } else {
          calendar.dates.push({
            date: day,
            isBooked: true,
            isBlocked: false,
            customPrice: 0, // Default value, adjust as needed
            // minimumStay: 1, // Default value, adjust as needed
            note: "", // Default value, adjust as needed
          });
        }
      });

      await calendar.save();

      const guest = await User.findOne(booking.guest);

      if (!guest) {
        res.status(404).json({ message: "Guest not found" });
        return;
      }

      guest.bookings.push(booking._id);

      await guest.save();
    }

    res.status(200).json({ message: `Booking ${status}`, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const bookings = await Booking.find({ renter: userId })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const bookingController = {
  createBooking,
  getHostBookings,
  updateBookingStatus,
  getUserBookings,
};

export default bookingController;
