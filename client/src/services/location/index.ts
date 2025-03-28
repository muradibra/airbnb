import axiosInstance from "../axiosInstance";

const searchLocations = async (input: string) => {
  return await axiosInstance.get(`/location/search?location=${input}`);
};

const locationService = {
  searchLocations,
};

export default locationService;
