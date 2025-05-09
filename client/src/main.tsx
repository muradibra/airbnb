import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { store } from "./store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "./config/query";

import "swiper/swiper-bundle.css";

import "react-phone-number-input/style.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </Provider>
);
