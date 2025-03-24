import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { paths } from "@/constants/paths";
import { queryKeys } from "@/constants/query-keys";
import userService from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/data-table/DataTable";

const DashboardUsersPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.ADMIN_USERS],
    queryFn: userService.getAllUsers,
  });

  const users = data?.data.users || [];

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
        <h2 className="text-white font-bold text-2xl">Users</h2>
      </div>
      <div className="bg-white rounded-md shadow-md">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default DashboardUsersPage;
