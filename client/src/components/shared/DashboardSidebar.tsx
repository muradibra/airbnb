import {
  Calendar,
  ChartBarStackedIcon,
  // CalendarIcon,
  // CarIcon,
  // ChartBarStackedIcon,
  Home,
  List,
  StarIcon,
  User2Icon,
  // MapPin,
  // MessageCircleIcon,
  // MessageSquareMoreIcon,
  // User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/constants/paths";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export const SideBarItems = [
  {
    title: "Dashboard",
    url: paths.DASHBOARD.MAIN,
    icon: Home,
  },
  {
    title: "Listings",
    url: paths.DASHBOARD.LISTINGS.LIST,
    icon: List,
  },
  {
    title: "Bookings",
    url: paths.DASHBOARD.BOOKINGS.LIST,
    icon: Calendar,
  },
  {
    title: "Users",
    url: paths.DASHBOARD.USERS.LIST,
    icon: User2Icon,
  },
  {
    title: "Reviews",
    url: paths.DASHBOARD.REVIEWS.LIST,
    icon: StarIcon,
  },
  {
    title: "Categories",
    url: paths.DASHBOARD.CATEGORIES.LIST,
    icon: ChartBarStackedIcon,
  },
  // {
  //   title: "Messages",
  //   url: paths.DASHBOARD.MESSAGES.LIST,
  //   icon: MessageCircle,
  // },
  // {
  //   title: "Settings",
  //   url: paths.DASHBOARD.SETTINGS.MAIN,
  //   icon: SettingsIcon,
  // },
  // {
  //   title: "Payments",
  //   url: paths.DASHBOARD.PAYMENTS.LIST,
  //   icon: CreditCardIcon,
  // },

  // {
  //   title: "Users",
  //   url: paths.DASHBOARD.USERS.LIST,
  //   icon: User2Icon,
  // },
  // {
  //   title: "Car Rents",
  //   url: paths.DASHBOARD.RENTS.LIST,
  //   icon: CarIcon,
  // },
  // {
  //   title: "Categories",
  //   url: paths.DASHBOARD.CATEGORIES.LIST,
  //   icon: ChartBarStackedIcon,
  // },
  // {
  //   title: "Locations",
  //   url: paths.DASHBOARD.LOCATIONS.LIST,
  //   icon: MapPin,
  // },
  // {
  //   title: "Reservations",
  //   url: paths.DASHBOARD.RESERVATIONS.LIST,
  //   icon: CalendarIcon,
  // },
  // {
  //   title: "Reviews",
  //   url: paths.DASHBOARD.REVIEWS.LIST,
  //   icon: MessageSquareMoreIcon,
  // },
  // {
  //   title: "Chat",
  //   url: paths.DASHBOARD.CHAT.VIEW,
  //   icon: MessageCircleIcon,
  // },
];
export const DashboardSidebar = () => {
  return (
    <Sidebar className="">
      <SidebarGroupContent className="pt-[112px]">
        <SidebarGroup>
          <SidebarGroupLabel className="">Airbnb Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="hover:text-[#ff385c]! transition-all duration-200"
                      to={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    className="hover:text-[#ff385c]! transition-all duration-200"
                    to={paths.HOME}
                  >
                    <IoArrowBack />
                    <span>Back To Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarGroupContent>
    </Sidebar>
  );
};
