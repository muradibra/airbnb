import axiosInstance from "../axiosInstance";

const getHostBookings = async () => {
  return await axiosInstance.get("/booking/host");
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
  updateBookingStatus,
};

export default bookingService;
