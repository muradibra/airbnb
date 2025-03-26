// bookingSlice.ts
import { Listing } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface CurrentBooking {
  listingId: string;
  listing: Listing;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guestCount: GuestCount;
  createdAt: string;
}

interface BookingState {
  currentBooking: CurrentBooking | null;
}

const initialState: BookingState = {
  currentBooking: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<CurrentBooking>) => {
      state.currentBooking = {
        ...action.payload,
        createdAt: new Date(Date.now()).toISOString(),
      };
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
});

export const { setCurrentBooking, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
