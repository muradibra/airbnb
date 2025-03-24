import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { paths } from "@/constants/paths";
import { queryKeys } from "@/constants/query-keys";
import listingService from "@/services/listing";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/data-table/DataTable";

const ListingsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.DASHBOARD_LISTINGS],
    queryFn: () => listingService.getListings(),
  });

  const listings = data?.data;

  if (isLoading) {
    <div className="flex flex-col gap-1 jkustify-center items-center mt-32">
      <Spinner />
      Loading...
    </div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-1 jkustify-center items-center mt-32">
        <p className="text-2xl font-bold mb-3 text-[#FF385C]">
          Something went wrong!
        </p>
        <Button className="mt-4" variant={"secondary"}>
          <Link to={paths.DASHBOARD.MAIN} className="text-[#FF385C]">
            Go Back To Home
          </Link>
        </Button>
      </div>
    );
  }

  console.log("Debugging listings:", listings);

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl">Listings</h2>
      </div>
      <div className="bg-white rounded-[10px]">
        <DataTable columns={columns} data={listings ? listings.listings : []} />
      </div>
    </div>
  );
};

export default ListingsPage;
