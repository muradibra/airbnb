// import { useAppSelector } from "@/hooks/redux";
// import { useDialog } from "@/hooks/useDialog";
// import { selectAuth } from "@/store/auth";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { queryKeys } from "@/constants/query-keys";
import listingService from "@/services/listing";

import { IoFilter } from "react-icons/io5";
import categoryService from "@/services/category";
import { HeartIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AiFillStar } from "react-icons/ai";
import { format } from "date-fns";

import { HashLoader } from "react-spinners";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";

const HomePage = () => {
  const { openDialog } = useDialog();
  // const { user } = useAppSelector(selectAuth);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const totalGuests = parseInt(searchParams.get("guests") || "0");
  const ameneties = searchParams.getAll("ameneties");
  const priceRange = searchParams.get("priceRange");
  const bedCount = searchParams.get("bedCount");
  const bedroomCount = searchParams.get("bedroomCount");
  const bathroomCount = searchParams.get("bathroomCount");

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      end.setDate(start.getDate() + 1);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev.toString());
        newParams.set("endDate", end.toISOString().split("T")[0]);
        return newParams;
      });
    }
  }

  const { data: categoriesData } = useQuery({
    queryKey: [queryKeys.CATEGORIES],
    queryFn: categoryService.getCategories,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: listingsLoading,
    // isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [queryKeys.LISTINGS, searchParams.toString()],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      listingService.getListings({
        skip: pageParam,
        take: 8,
        category: category ?? "",
        location: location ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        guests: totalGuests,
        amenities: ameneties,
        priceRange: priceRange ? priceRange : undefined,
        bedroomCount: bedroomCount ? Number(bedroomCount) : undefined,
        bedCount: bedCount ? Number(bedCount) : undefined,
        bathroomCount: bathroomCount ? Number(bathroomCount) : undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const hasMore =
        lastPage.data.count > lastPage.data.skip + lastPage.data.take;
      if (hasMore) {
        return lastPage.data.skip + lastPage.data.take;
      }
      return undefined;
    },
  });

  if (listingsLoading) {
    return (
      <div className="text-4xl z-[9999] flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 min-h-screen bg-white">
        <HashLoader color="#FF5252" size={75} />
      </div>
    );
  }

  const listings =
    data?.pages.reduce(
      (prev, page) => [...prev, ...page.data.listings],
      [] as any[]
    ) || [];

  const categories = categoriesData?.data.items;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div className="px-[24px] md:px-[40px] xxl:px-[80px]">
      {/* Catagories section */}
      <div className="border-b pb-5">
        <div className="container mx-auto px-5 md:px-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <div className="flex gap-8 min-w-max">
                {categories?.map((cat) => {
                  const isSelected = category === cat._id;

                  return (
                    <button
                      key={cat._id}
                      className={`flex cursor-pointer flex-col items-center gap-2 pb-4 border-b-2 transition-all ${
                        isSelected
                          ? "text-black opacity-100 border-black"
                          : "text-gray-500 opacity-60 border-transparent hover:opacity-100 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        const newParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        const current = searchParams.get("category");

                        if (current === cat._id) {
                          newParams.delete("category");
                        } else {
                          newParams.set("category", cat._id);
                        }

                        setSearchParams(newParams);
                      }}
                    >
                      <img src={cat.icon} alt={cat.name} className="w-6 h-6" />
                      <span className="text-xs font-medium">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => openDialog(DialogTypeEnum.FILTER)}
              className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl border hover:shadow-md transition-all "
            >
              <IoFilter />
              <span className="hidden sm:inline-block">Filters</span>
            </button>
          </div>
        </div>
      </div>
      <div className="my-4 listings-container">
        <InfiniteScroll
          dataLength={listings.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex flex-col items-center w-60 mx-auto gap-x-3 text-muted-foreground mt-4">
              <p>Loading more listings...</p>
            </div>
          }
          endMessage={
            <div>
              <p className="text-center">No more listings to show</p>
            </div>
          }
          scrollThreshold={0.5}
          scrollableTarget="listings-container"
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {listings.map((listing) => (
              <div key={listing._id} className="block relative">
                <div className="absolute top-2 right-2 z-[10] cursor-pointer p-2">
                  <HeartIcon className="w-6 h-6 text-white shadow-2xl" />
                </div>
                <Link
                  to={`listings/${listing._id}`}
                  className="flex flex-col gap-y-[12px]"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[10px] ">
                    <Swiper
                      spaceBetween={50}
                      slidesPerView={1}
                      loop={true}
                      modules={[Pagination, Navigation]}
                      pagination={{
                        dynamicBullets: true,
                      }}
                      navigation={{
                        prevEl: ".custom-prev",
                        nextEl: ".custom-next",
                      }}
                      className="relative group"
                    >
                      <button className="custom-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white shadow-md transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4 text-black" />
                      </button>
                      <button className="custom-next absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white shadow-md transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed">
                        <ChevronRight className="w-4 h-4 text-black" />
                      </button>
                      {listing.images.map((img: string) => (
                        <SwiperSlide key={img} className="aspect-[4/3]">
                          <img
                            src={img}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-[15px]">{listing.title}</p>
                      <p className="text-gray-600 line-clamp-2 text-[14px]">
                        {format(today, "MMM d")} - {format(tomorrow, "MMM d")}
                      </p>
                      <p className=" text-[13px]">
                        <span className="font-medium !text-[15px]">
                          ${listing.pricePerNight}
                        </span>{" "}
                        per night
                      </p>
                      <p className="text-sm text-gray-500">
                        {listing.location}
                      </p>
                      {/* <p className="text-sm text-gray-500">
                      {listing.category.name}
                    </p> */}
                    </div>
                    <div>
                      <span className="flex items-center gap-x-1">
                        <AiFillStar className="w-4 h-4" />
                        5.0
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;
