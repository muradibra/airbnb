import axiosInstance from "../axiosInstance";
import { CreateListing, CreateListingData, GetHostListings } from "./types";

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
  getHostListings,
  getHostListingById,
  createListing,
  editListing,
  removeListing,
};

export default listingService;
