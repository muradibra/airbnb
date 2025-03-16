import axiosInstance from "./axiosInstance";

export type TCountry = {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      eng: {
        official: string;
        common: string;
      };
    };
  };
};

export const getCountries = async () => {
  const { data } = await axiosInstance.get(
    "https://restcountries.com/v3.1/all?fields=name,flags"
  );

  const sortedData = data.sort((a: TCountry, b: TCountry) =>
    a.name.common.localeCompare(b.name.common)
  );

  return sortedData;
};
