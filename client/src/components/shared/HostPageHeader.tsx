import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/constants/paths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutAsync, selectAuth } from "@/store/auth";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "./Spinner";

const HostPageHeader = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(selectAuth);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="host-page-header px-[21px] py-[10px] border-b border-[#dfdfdf]">
      <div className="header-inner flex justify-between items-center">
        <div className="logo w-[46px] h-[53px]">
          <img
            src="/src/assets/images/airbnb-host-icon.png"
            className="w-full h-full object-cover"
            alt="Logo"
          />
        </div>

        <ul className="header-middle hidden xl:flex items-center gap-6">
          <li>
            <NavLink
              to={paths.HOST.MAIN}
              className={() =>
                location.pathname === paths.HOST.MAIN
                  ? "active-link"
                  : undefined
              }
            >
              Host
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.HOST.CALENDAR}
              className={() =>
                location.pathname === paths.HOST.CALENDAR
                  ? "active-link"
                  : undefined
              }
            >
              Calendar
            </NavLink>
          </li>{" "}
          <li>
            <NavLink
              to={paths.HOST.LISTINGS.MAIN}
              className={() =>
                location.pathname === paths.HOST.LISTINGS.MAIN
                  ? "active-link"
                  : undefined
              }
            >
              Listings
            </NavLink>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                Menu
                <FaChevronDown className="inline-block ml-1 w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`${paths.HOST.MAIN}?createListing=true`)
                  }
                  className="cursor-pointer hover:bg-[#e8e8e8]"
                >
                  Create New Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        <div className="dropdown xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer p-3 border border-[#dfdfdf] rounded-full">
              <FaBars />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                <NavLink to={paths.HOST.MAIN} className="block w-full">
                  Host
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                <NavLink to={paths.HOST.CALENDAR} className="block w-full">
                  Calendar
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                <NavLink to={paths.HOST.LISTINGS.MAIN} className="block w-full">
                  Listings
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                <NavLink to={paths.HOST.BOOKINGS.MAIN} className="block w-full">
                  Bookings
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                <NavLink to={paths.HOST.LISTINGS.MAIN} className="block w-full">
                  Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch(logoutAsync())}
                className="cursor-pointer hover:bg-[#e8e8e8]"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden user-avatar xl:block">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              {loading ? (
                <Spinner />
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar!}
                    className="w-full h-full object-cover"
                    alt="User"
                  />
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#e8e8e8]">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch(logoutAsync())}
                className="cursor-pointer hover:bg-[#e8e8e8]"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default HostPageHeader;
