import ImageGallery from "./components/ImageGallery";
import listingService from "@/services/listing";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// import { RiArrowDropRightLine } from "react-icons/ri";
// import { GoStarFill } from "react-icons/go";
import { LiaUmbrellaBeachSolid } from "react-icons/lia";
import { useEffect } from "react";
import BookingSection from "./components/BookingSection";
import { useAppDispatch } from "@/hooks/redux";
import { clearCurrentBooking } from "@/store/booking/bookingSlice";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { data: listingData } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingService.getListingById(id!),
  });

  const listing = listingData?.data.listing;
  const listingCalendar = listingData?.data.calendar;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(clearCurrentBooking());
  }, [id]);

  return (
    <div className="px-[24px] md:px-[40px] xxl:px-[80px] ">
      {/* detailpage image slider */}
      <div>
        <p className="text-2xl font-bold text-[#222] pb-6">{listing?.title}</p>
        {listing?.images && <ImageGallery images={listing.images} />}
      </div>

      <div className="py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[60%]">
            <div className="pb-8 border-b-[1px] border-b-[#ddd]">
              <p className="text-2xl font-medium text-[#222]">
                {listing?.address.city}, {listing?.address.country}
              </p>
              <div className="flex gap-2 items-center mt-1 mb-2">
                <span className="text-base font-medium text-[#222]">
                  {listing?.maxGuestCount} guests
                </span>
                <span>.</span>
                <span className="text-base font-medium text-[#222]">
                  {listing?.bedroomCount} bedrooms
                </span>
                <span>.</span>
                <span className="text-base font-medium text-[#222]">
                  {listing?.bedCount} beds
                </span>
                <span>.</span>
                <span className="text-base font-medium text-[#222]">
                  {listing?.bathroomCount} baths
                </span>
              </div>
              {/* <div className="flex items-center gap-1">
                <GoStarFill />
                <span className="text-base font-medium text-[#222] underline cursor-pointer">
                  2 reviews
                </span>
              </div> */}
            </div>
            <div className="py-6 border-b-[1px] border-b-[#ddd]">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={listing?.host.avatar}
                    alt="Host"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-medium text-[#222]">
                    Hosted by {listing?.host.name}
                  </p>
                  {/* <p className="text-sm font-medium text-[#6a6a6a]">
                    11 years hosting
                  </p> */}
                </div>
              </div>
            </div>
            <div className="py-8 border-b-[1px] border-b-[#ddd]">
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <LiaUmbrellaBeachSolid className="text-3xl text-[#222]" />
                    <div>
                      <p className="text-base font-medium text-[#222]">
                        13-min walk to the beach
                      </p>
                      <p className="text-sm font-medium text-[#6a6a6a]">
                        This is one of the few places in the area with a pool.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="py-8 border-b-[1px] border-b-[#ddd]">
              {/* <div className="p-4 bg-[#f7f7f7] rounded-md">
                <p>
                  Some info has been automatically translated.{" "}
                  <span className="text-[#222] font-semibold underline cursor-pointer">
                    Show original
                  </span>
                </p>
              </div> */}
              <div className="mt-8">
                <p className="leading-6 text-base font-normal text-[#222]">
                  description: {listing?.description}
                  {/* <br />
                  Sleeps 6 people and 2 extra people with camp beds */}
                </p>
              </div>
            </div>

            <div className="py-12 border-b-[1px] border-b-[#ddd]">
              <p className="text-2xl font-semibold text-[#222] mb-6">
                What this place offers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listing?.amenities.map((amenity: any, idx: number) => (
                  <div className="flex items-center gap-3" key={idx}>
                    <span className="text-base text-[#222] font-semibold">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="py-3 px-6 text-lg text-[#222] cursor-pointer font-medium mt-6 border-[1px] border-[#222] transition duration-300
                   hover:bg-[#2222220d] rounded-md"
              >
                Show all amenities
              </button>
            </div>
            <div>{/* <DetailCalendar /> */}</div>
          </div>
          <div className="w-full md:w-[30%]">
            {listing && (
              <BookingSection
                listingId={id!}
                listing={listing}
                listingCalendar={listingCalendar}
              />
            )}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      {listing?.reviews.length > 0 ? (
        <div className="py-12 border-t-[1px] border-t-[#ddd]">
          <div className="flex flex-col gap-3 mb-10">
            <p className="text-2xl font-bold text-[#222]">
              {listing?.reviews.length} reviews
            </p>
            <p className="text-lg text-[#6a6a6a] font-medium">
              Average rating will appear after 3 reviews
            </p>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar sm:grid  sm:grid-cols-1  md:grid-cols-2 gap-4 sm:gap-8 md:gap-24">
            {listing?.reviews.map((review: any, index: number) => (
              <div className="flex flex-col gap-4" key={index}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={review.reviewer.avatar}
                      alt="Reviewer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#222]">
                      {review.reviewer.name}
                    </p>
                    <p className="text-sm font-medium text-[#6a6a6a]">
                      {review.date}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-base font-normal text-[#222]">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12">
          <p className="text-2xl font-bold text-[#222]">No reviews yet</p>
        </div>
      )}
      {/* <div className="py-12 border-t-[1px] border-t-[#ddd]">
        <div className="flex flex-col gap-3 mb-10">
          <p className="text-2xl font-bold text-[#222]">2 reviews</p>
          <p className="text-lg text-[#6a6a6a] font-medium">
            Average rating will appear after 3 reviews
          </p>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar sm:grid  sm:grid-cols-1  md:grid-cols-2 gap-4 sm:gap-8 md:gap-24">
          {Array.from({ length: 2 }).map((_, index) => (
            <ReviewCard key={index} />
          ))}
        </div>
      </div> */}

      {/* Map section */}
      <div className="border-t-[1px] border-t-[#ddd] py-12">
        <p className="text-2xl font-bold text-[#222] mb-12">Where you'll be</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.6164865477394!2d49.837493077768414!3d40.373027371446696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dd0611a0c1f%3A0xa69747dad66b0a38!2sCaravan%20Baku!5e0!3m2!1saz!2saz!4v1739863274058!5m2!1saz!2saz"
          className="w-full h-[450px] rounded-lg"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* <div className="mt-10 flex flex-col gap-3">
          <p className="text-base font-medium text-[#222]">Famagusta, Cyprus</p>
          <p className="text-base text-[#6a6a6a] leading-7 line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            provident nesciunt dolore, illo repellendus molestiae sunt facilis
            velit repudiandae? Tenetur inventore ex consectetur magni neque
            molestiae excepturi praesentium in voluptatem officiis repudiandae
            culpa sequi, assumenda blanditiis ipsam odio maxime amet ducimus qui
            tempora quaerat. Vitae id odit nesciunt non hic iusto impedit, illum
            eaque qui, dolorum magni, at enim quaerat voluptates nemo error.
            Reprehenderit eveniet libero voluptate, quidem laborum, debitis
            pariatur ut quasi facere dolorum sed veniam excepturi fuga
            distinctio odit non ipsum quo. Voluptatem nesciunt amet aut aliquam
            rem eligendi aspernatur excepturi perspiciatis deleniti! Quae
            numquam magni rerum accusantium.
          </p>
          <div>
            <button className="text-lg underline text-[#222] cursor-pointer font-medium mt-2 flex items-center gap-1 ">
              <span>Show more</span>
              <RiArrowDropRightLine className="text-2xl text-[#222]" />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ListingDetailsPage;
