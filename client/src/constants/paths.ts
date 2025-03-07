export const paths = {
  HOME: "/",
  DASHBOARD: {
    MAIN: "/dashboard",
    LISTINGS: {
      LIST: "/dashboard/listings",
      CREATE: "/dashboard/listings/create",
      EDIT: "/dashboard/listings/:id/edit",
    },
    BOOKINGS: {
      LIST: "/dashboard/bookings",
    },
    USERS: {
      LIST: "/dashboard/users",
    },
    REVIEWS: {
      LIST: "/dashboard/reviews",
    },
    SETTINGS: {
      MAIN: "/dashboard/settings",
    },
    PAYMENTS: {
      LIST: "/dashboard/payments",
      CREATE: "/dashboard/payments/create",
      EDIT: "/dashboard/payments/:id/edit",
    },
    CATEGORIES: {
      LIST: "/dashboard/categories",
      CREATE: "/dashboard/categories/create",
      EDIT: (id: string) => `/dashboard/categories/:${id}/edit`,
    },
  },
  AUTH: {
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    VERIFY_EMAIL_SUCCESS: "/verify-email-success",
    VERIFY_EMAIL_ERROR: "/verify-email-error",
    VERIFY_EMAIL_RESEND: "/verify-email-resend",
    VERIFY_EMAIL_RESEND_SUCCESS: "/verify-email-resend-success",
    VERIFY_EMAIL_RESEND_ERROR: "/verify-email-resend-error",
  },
  LISTING: {
    MAIN: "/listings",
    DETAIL: "/listings/:id",
    CREATE: "/listings/create",
    EDIT: "/listings/:id/edit",
    SEARCH: "/listings/search",
    CATEGORY: "/listings/category/:category",
    SEARCH_RESULTS: "/listings/search-results",
    SEARCH_RESULTS_CATEGORY: "/listings/search-results/:category",
  },
  PROFILE: {
    MAIN: "/profile",
    EDIT: "/profile/edit",
    PASSWORD: "/profile/password",
    BOOKINGS: "/profile/bookings",
  },
  PAYMENT: (id = ":id") => `/payment/${id}`,
  //   SUCCESS: "/payment/success",
  //   ERROR: "/payment/error",
  //   PENDING: "/payment/pending",
  // },
  ERROR: {
    NOT_FOUND: "/404",
    INTERNAL_SERVER_ERROR: "/500",
    UNAUTHORIZED: "/401",
    FORBIDDEN: "/403",
  },
  HOST: {
    MAIN: "/host",
    LISTINGS: {
      MAIN: "/host/listings",
      CREATE: "/host/listings/create",
      EDIT: "/host/listings/:id/edit",
    },
    BOOKINGS: {
      MAIN: "/host/bookings",
    },
  },
};
