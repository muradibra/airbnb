import axiosInstance from "../axiosInstance";

type CreateBooking = {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guestCount: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
};

const getHostBookings = async () => {
  return await axiosInstance.get("/booking/host");
};

const createBooking = async (data: CreateBooking) => {
  return await axiosInstance.post("/booking", data);
};

const updateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: "approved" | "rejected";
}) => {
  return await axiosInstance.put(`/booking/${bookingId}`, { status });
};

const bookingService = {
  getHostBookings,
  createBooking,
  updateBookingStatus,
};

export default bookingService;
