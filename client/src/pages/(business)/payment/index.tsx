import { useNavigate } from "react-router-dom";
import { Steps } from "./components/Steps";
import { PaymentSummary } from "./components/Summary";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCurrentBooking } from "@/store/booking/bookingSlice";
import { paths } from "@/constants/paths";
import { useAppSelector } from "@/hooks/redux";

const PaymentPage = () => {
  const currentBooking = useAppSelector(
    (state) => state.booking.currentBooking
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: idFromURL } = useParams<{ id: string }>();

  useEffect(() => {
    if (!currentBooking) {
      console.log("currentBooking", currentBooking);

      console.log("No current booking");
      window.history.back();
      return;
    }

    const age = Date.now() - new Date(currentBooking.createdAt).getTime();
    if (age > 15 * 60 * 1000) {
      console.log("clearing current booking");

      dispatch(clearCurrentBooking());
      navigate(paths.HOME);
      return;
    }

    if (currentBooking.listingId !== idFromURL) {
      console.log(`---${currentBooking.listingId}---`, `${idFromURL}`);

      dispatch(clearCurrentBooking());
      console.log("Bookings do not match");
      window.history.back();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container py-8 grid lg:grid-cols-[1fr_400px] gap-8">
      {currentBooking && <Steps bookingData={currentBooking} />}
      {currentBooking && <PaymentSummary booking={currentBooking} />}
    </div>
  );
};

export default PaymentPage;
