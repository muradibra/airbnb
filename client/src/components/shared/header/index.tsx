import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "@/assets/images/airbnb-host-icon.png";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutAsync, selectAuth } from "@/store/auth";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import roleService from "@/services/role";
import { UserRole } from "@/types";

function Header() {
  const { user, loading } = useAppSelector(selectAuth);
  const { openDialog } = useDialog();
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const guests = searchParams.get("guests");

  const { mutate: turnHost, isPending: turnHostPending } = useMutation({
    mutationFn: roleService.makeHost,
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "You are now a host!");
    },
  });

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
    }
    return "Any week";
  };

  const formatGuests = () => {
    if (guests) {
      return `${guests} guest${Number(guests) > 1 ? "s" : ""}`;
    }
    return "Add guests";
  };

  console.log("user", user);

  const logout = () => {
    dispatch(logoutAsync());
    toast.success("You have logged out");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 bg-white ${
        isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="px-[24px] md:px-[40px] xxl:px-[80px]">
        {/* Top Section */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="w-[40px] h-[50px] md:w-[52px] md:h-[64px]">
              <img
                className="w-full h-full object-cover"
                src={logo}
                alt="Airbnb Logo"
              />
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, visible on tablet and up */}
          <div className="block flex-1 max-w-2xl">
            <div className="flex items-center justify-center">
              <button
                onClick={() => openDialog(DialogTypeEnum.SEARCH)}
                className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-3 bg-white rounded-full border hover:shadow-md transition-all cursor-pointer"
              >
                <span className="hidden sm:block font-medium text-sm md:text-base">
                  {location || "Anywhere"}
                </span>
                <span className="h-5 w-[1px] bg-gray-300 hidden sm:block"></span>
                <span className="font-medium text-sm md:text-base hidden sm:block">
                  {formatDateRange()}
                </span>
                <span className="h-5 w-[1px] bg-gray-300 hidden md:block"></span>
                <span className="text-gray-500 text-sm md:text-base hidden md:block">
                  {formatGuests()}
                </span>
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#FF5252] rounded-full flex items-center justify-center">
                  <FaSearch className="text-white text-sm md:text-base" />
                </div>
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <div className="flex justify-between items-center p-2 ps-[14px] border-2 border-[#ddd] rounded-[30px]">
                  <RxHamburgerMenu color="#222" />
                  <div className="ms-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      className="fill-[#6a6a6a] w-8 h-8"
                    >
                      <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
                    </svg>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!loading && user ? (
                  <>
                    <DropdownMenuItem>
                      <Link className="w-full h-full" to={`/profile`}>
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    {user.role === UserRole.Guest && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => turnHost(user._id)}
                        disabled={turnHostPending}
                      >
                        {turnHostPending ? "Loading..." : "Become a host"}
                      </DropdownMenuItem>
                    )}
                    {/* <DropdownMenuItem>Airbnb your home</DropdownMenuItem> */}
                    {user.role === "host" && (
                      <DropdownMenuItem>
                        <Link className="w-full h-full" to="/host/listings">
                          My Listings
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "admin" && (
                      <DropdownMenuItem>
                        <Link to="/dashboard" className="w-full h-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => openDialog(DialogTypeEnum.LOGIN)}
                    >
                      Log in
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => openDialog(DialogTypeEnum.REGISTER)}
                    >
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Tabs - Only visible when scrolled */}
        {/* {isScrolled && (
          <div className="mt-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 md:gap-8 justify-start md:justify-center min-w-max px-4 md:px-0">
              {["Stays", "Experiences", "Online Experiences"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-sm md:text-base text-gray-600 hover:text-gray-900 whitespace-nowrap ${
                    activeTab === tab.toLowerCase()
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </header>
  );
}

export default Header;
