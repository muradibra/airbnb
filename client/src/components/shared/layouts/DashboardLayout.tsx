import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";
import { Spinner } from "../Spinner";
import { toast } from "sonner";
import { Navigate, Outlet } from "react-router-dom";
import { paths } from "@/constants/paths";
import { UserRole } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../DashboardSidebar";

const DashboardLayout = () => {
  const { user, loading } = useAppSelector(selectAuth);
  console.log(loading);

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-1 items-center mt-32">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (!user || user.role !== UserRole.Admin) {
    toast.error("You are not authorized to access this page!");
    return <Navigate to={paths.HOME} />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full px-6 relative pt-4 ">
        <SidebarTrigger className="absolute left-8 top-6 cursor-pointer text-[#FF385C] transition-all duration-200 hover:text-[#FF385C]" />
        <div className="p-6 rounded-[10px] w-full ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
