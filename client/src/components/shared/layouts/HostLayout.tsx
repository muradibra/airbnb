import { Outlet, useNavigate } from "react-router-dom";
// import { Navbar } from "./navbar";

// import { Dialogs } from "../dialogs";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { getCurrentUserAsync, selectAuth } from "@/store/auth";
import { paths } from "@/constants/paths";
import { toast } from "sonner";
import HostPageHeader from "../HostPageHeader";

const HostLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentUserAsync());
  }, []);
  const { user, loading } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!loading && (!user?.role || user.role !== "host")) {
      toast.error("You are not authorized to view this page");
      navigate(paths.HOME);
    }
  }, [user, loading]);

  return (
    <div>
      <HostPageHeader />
      <Outlet />
      {/* <Dialogs /> */}
    </div>
  );
};

export default HostLayout;
