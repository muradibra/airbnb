import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/(business)/home";
import RootLayout from "@/components/shared/layouts/RootLayout";
import { paths } from "@/constants/paths";
import AuthLayout from "@/components/shared/layouts/AuthLayout";
import PaymentPage from "@/pages/(business)/payment";
import DashboardLayout from "@/components/shared/layouts/DashboardLayout";
import DashboardMainPage from "@/pages/(dashboard)/main";
import DashboardUsersPage from "@/pages/(dashboard)/users";
import DashboardCategories from "@/pages/(dashboard)/category";
import CategoryCreatePage from "@/pages/(dashboard)/category/create";
import CategoryUpdatePage from "@/pages/(dashboard)/category/edit";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: paths.HOME,
        element: <HomePage />,
      },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: paths.PAYMENT(),
            element: <PaymentPage />,
          },
        ],
      },

      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            path: paths.DASHBOARD.MAIN,
            element: <DashboardMainPage />,
          },
          {
            path: paths.DASHBOARD.USERS.LIST,
            element: <DashboardUsersPage />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.LIST,
            element: <DashboardCategories />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.CREATE,
            element: <CategoryCreatePage />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.EDIT(":id"),
            element: <CategoryUpdatePage />,
          },
        ],
      },
    ],
  },
]);
