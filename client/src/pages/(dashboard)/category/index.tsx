import { DataTable } from "@/components/shared/data-table/DataTable";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/category";
import { queryKeys } from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { paths } from "@/constants/paths";
import { Spinner } from "@/components/shared/Spinner";

const DashboardCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.ADMIN_CATEGORIES],
    queryFn: categoryService.getCategories,
  });

  const categories = data?.data.items || [];

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
          <Link to={paths.HOME} className="text-[#FF385C]">
            Go Back To Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl">Categories</h2>
        <Button variant={"outline"} asChild>
          <Link to={paths.DASHBOARD.CATEGORIES.CREATE}>Create Category</Link>
        </Button>
      </div>
      <div className="bg-white rounded-[10px]">
        <DataTable columns={columns} data={categories} />
      </div>
    </div>
  );
};

export default DashboardCategories;
