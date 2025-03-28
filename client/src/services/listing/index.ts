import axiosInstance from "../axiosInstance";
import { CreateListing, CreateListingData, GetHostListings } from "./types";

type GetAllListingsPayload = {
  skip?: number;
  take?: number;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  priceRange?: string;
  bedroomCount?: string | number;
  bedCount?: string | number;
  bathroomCount?: string | number;
  amenities?: string[];
  // sort: string;
};

const getListings = async (data?: GetAllListingsPayload) => {
  const params = new URLSearchParams();
  if (data?.skip) params.append("skip", data.skip.toString());
  if (data?.take) params.append("take", data.take.toString());
  if (data?.category) params.append("category", data.category);
  if (data?.location) params.append("location", data.location);
  console.log("data?.location inside getListings service", data?.location);

  if (data?.startDate) {
    console.log(data?.startDate);

    params.append("startDate", data.startDate);
  }
  if (data?.endDate) {
    console.log(data?.endDate);

    params.append("endDate", data.endDate);
  }
  if (data?.guests) params.append("guests", String(data.guests));

  if (data?.priceRange) params.append("priceRange", data.priceRange);
  if (data?.bedroomCount)
    params.append("bedroomCount", String(data.bedroomCount));
  if (data?.bedCount) params.append("bedCount", String(data.bedCount));
  if (data?.bathroomCount)
    params.append("bathroomCount", String(data.bathroomCount));
  // if(data?.maxGuestCount) params.append("maxGuestCount", data.maxGuestCount);
  // if (data?.priceMin) params.append("priceMin", data.priceMin);
  // if (data?.priceMax) params.append("priceMax", data.priceMax);
  // if(data?.sort) params.append("sort", data.sort);
  if (data?.amenities)
    data?.amenities.forEach((amenity) => {
      params.append("amenities", amenity);
    });

  return axiosInstance.get(`/listing/all?${params.toString()}`);
};

const getListingById = async (id: string) => {
  return axiosInstance.get(`/listing/${id}`);
};

const getHostListings = async () => {
  return axiosInstance.get<GetHostListings>("/listing/host");
};

const createListing = async (data: CreateListingData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);

  formData.append("address.country", data.address.country);
  formData.append("address.street", data.address.street);
  formData.append("address.city", data.address.city);
  formData.append("address.state", data.address.state || "");
  formData.append("address.zipCode", data.address.zip || "");

  data.amenities.forEach((amenity, index) => {
    formData.append(`amenities[${index}]`, amenity);
  });

  formData.append("bedroomCount", data.conditions.bedroomCount.toString());
  formData.append("bedCount", data.conditions.bedCount.toString());
  formData.append("bathroomCount", data.conditions.bathroomCount.toString());
  formData.append("maxGuestCount", data.conditions.maxGuestCount.toString());

  formData.append("pricePerNight", data.pricePerNight.toString());

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  return axiosInstance.post<CreateListing>("/listing/create", formData);
};

const getHostListingById = async (id: string) => {
  return axiosInstance.get(`/listing/host/listing/${id}`);
};

const editListing = async ({
  data,
  id,
}: {
  data: CreateListingData;
  id: string;
}) => {
  console.log("🚀 Debugging images before sending:", data.images);

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);

  formData.append("address.country", data.address.country);
  formData.append("address.street", data.address.street);
  formData.append("address.city", data.address.city);
  formData.append("address.state", data.address.state || "");
  formData.append("address.zipCode", data.address.zip || "");

  data.amenities.forEach((amenity, index) => {
    formData.append(`amenities[${index}]`, amenity);
  });

  formData.append("bedroomCount", data.conditions.bedroomCount.toString());
  formData.append("bedCount", data.conditions.bedCount.toString());
  formData.append("bathroomCount", data.conditions.bathroomCount.toString());
  formData.append("maxGuestCount", data.conditions.maxGuestCount.toString());

  formData.append("pricePerNight", data.pricePerNight.toString());

  data.images.forEach((image, index) => {
    if (typeof image === "string") {
      // Old image (URL)
      formData.append(`images[${index}][type]`, "old");
      formData.append(`images[${index}][value]`, image);
    } else {
      // New image (File)
      formData.append(`images[${index}][type]`, "new");
      formData.append(`images[${index}][value]`, image);
    }
  });

  return axiosInstance.put(`/listing/update/${id}`, formData);
};

export const removeListing = async (id: string) => {
  return axiosInstance.delete(`/listing/delete/${id}`);
};

const listingService = {
  getListings,
  getListingById,
  getHostListings,
  getHostListingById,
  createListing,
  editListing,
  removeListing,
};

export default listingService;
