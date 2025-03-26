import { useNavigate } from "react-router-dom";
import { Steps } from "./components/Steps";
import { PaymentSummary } from "./components/Summary";
// import { useQuery } from "@tanstack/react-query";
// import { queryKeys } from "@/constants/query-keys";
// import { Spinner } from "@/components/shared/Spinner";
// import { Button } from "@/components/ui/button";
// import { paths } from "@/constants/paths";
import { useParams } from "react-router-dom";
// import { ScrollToTop } from "@/components/shared/ScrollToTop";
// import rentService from "@/services/rent";
// import bookingService from "@/services/booking";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCurrentBooking } from "@/store/booking/bookingSlice";
import { RootState } from "@/store";
import { paths } from "@/constants/paths";

const PaymentPage = () => {
  const currentBooking = useSelector(
    (state: RootState) => state.booking.currentBooking
  );
  const navigate = useNavigate();
  // const location = useLocation();
  // const bookingData = location.state?.bookingData;
  // const { tempBookingId } = useParams();
  const dispatch = useDispatch();
  const { listingId: idFromURL } = useParams<{ listingId: string }>();

  // Fetch temporary booking details
  // const { data, isLoading } = useQuery({
  //   queryKey: [queryKeys.TEMP_BOOKING, tempBookingId],
  //   queryFn: () => bookingService.getTemporaryBooking(tempBookingId!),
  //   staleTime: 0, // Always fetch fresh data
  // });

  // Check if booking is valid (exists and not older than 15 minutes)
  // useEffect(() => {
  //   if (!currentBooking) {
  //     navigate(paths.HOME);
  //     return;
  //   }

  //   const bookingAge = Date.now() - currentBooking.createdAt;
  //   if (bookingAge > 15 * 60 * 1000) {
  //     // 15 minutes
  //     dispatch(clearCurrentBooking());
  //     navigate(paths.HOME);
  //     return;
  //   }
  // }, [currentBooking]);

  useEffect(() => {
    // Check if there is a current booking
    if (!currentBooking) {
      console.log("No current booking");
      window.history.back();
      // navigate(`/listings/${idFromURL}`);
      return;
    }

    // Expire the booking after 15 minutes
    const age = Date.now() - new Date(currentBooking.createdAt).getTime();
    if (age > 15 * 60 * 1000) {
      dispatch(clearCurrentBooking());
      navigate(paths.HOME);
      return;
    }

    // Prevent booking another listing without resetting
    if (currentBooking.listingId !== idFromURL) {
      dispatch(clearCurrentBooking());
      console.log("Bookings do not match");
      window.history.back();
      // navigate(`/listings/${idFromURL}`);
    }
  }, [currentBooking, idFromURL, navigate, dispatch]);

  // if (isLoading) return <Spinner />;

  // if (!data?.tempBooking) {
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <p>This booking session has expired or is invalid.</p>
  //       <Button onClick={() => navigate(-1)}>Go Back</Button>
  //     </div>
  //   );
  // }

  return (
    <div className="container py-8 grid lg:grid-cols-[1fr_400px] gap-8">
      {currentBooking && <Steps bookingData={currentBooking} />}
      {currentBooking && <PaymentSummary booking={currentBooking} />}
      {/* <ScrollToTop /> */}
    </div>
  );
};

export default PaymentPage;
