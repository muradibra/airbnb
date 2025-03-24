import { Button } from "@/components/ui/button";
import { paths } from "@/constants/paths";
import { useAppSelector } from "@/hooks/redux";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import { selectAuth } from "@/store/auth";
import { UserRole } from "@/types";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { queryKeys } from "@/constants/query-keys";
import listingService from "@/services/listing";

const HomePage = () => {
  const { openDialog } = useDialog();
  const { user } = useAppSelector(selectAuth);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const bedroomCount = searchParams.get("bedroomCount");
  const bedCount = searchParams.get("bedCount");
  const bathroomCount = searchParams.get("bathroomCount");
  const location = searchParams.get("location");
  const ameneties = searchParams.getAll("ameneties");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    //  isLoading,
    // isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [queryKeys.LISTINGS, searchParams.toString()],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      listingService.getListings({
        skip: pageParam,
        take: 2,
        category: category ?? "",
        location: location ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        bedroomCount: bedroomCount ?? "",
        bedCount: bedCount ?? "",
        bathroomCount: bathroomCount ?? "",
        amenities: ameneties,
        priceMax: "",
        priceMin: "",
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

  const listings =
    data?.pages.reduce(
      (prev, page) => [...prev, ...page.data.listings],
      [] as any[]
    ) || [];

  console.log(listings);

  console.log("Listings length:", listings.length);

  return (
    <div className="p-4">
      HomePage
      <Button onClick={() => openDialog(DialogTypeEnum.LOGIN)}>Log In</Button>
      {user?.role === UserRole.Admin && (
        <Link to={paths.DASHBOARD.CATEGORIES.LIST}>Go to Dashboard</Link>
      )}
      {user?.role === UserRole.Host && (
        <Link to={paths.HOST.CALENDAR}>Go to Host Calendar</Link>
      )}
      <div className="min-h-screen my-4">
        <InfiniteScroll
          dataLength={listings.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex flex-col items-center w-60 mx-auto gap-x-3 text-muted-foreground mt-4">
              <p>Scroll to load more items...</p>
            </div>
          }
          endMessage={
            <div>
              <p className="text-center">No more listings to show</p>
            </div>
          }
        >
          <div className="flex flex-col gap-y-4 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-8">
            {listings.map((listing) => (
              <Link
                to={`listings/${listing._id}`}
                key={listing._id}
                className="w-full md:w-1/3"
              >
                <div className="">
                  <img src={listing.images[0]} alt={listing.title} />
                </div>
                <p>{listing.title}</p>
                <p>{listing.description}</p>
                <p>{listing.price}</p>
                <p>{listing.location}</p>
                <p>{listing.category.name}</p>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;
