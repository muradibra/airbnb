import { DataTable } from "@/components/shared/data-table/DataTable";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/category";
import { queryKeys } from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { paths } from "@/constants/paths";

const DashboardCategories = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.ADMIN_CATEGORIES],
    queryFn: categoryService.getCategories,
  });

  const categories = data?.data.items || [];

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-primary font-bold text-2xl ">Categories</h2>
        <Button asChild>
          <Link to={paths.DASHBOARD.CATEGORIES.CREATE}>Create Category</Link>
        </Button>
      </div>
      <div className=" ">
        <DataTable columns={columns} data={categories} />
      </div>
    </div>
  );
};

export default DashboardCategories;
