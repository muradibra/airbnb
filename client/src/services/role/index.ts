import { User } from "@/types";
import axiosInstance from "../axiosInstance";

type MakeHostResponse = {
  message: string;
  user: User
}

const makeHost = async (id: string) => {
  return await axiosInstance.patch<MakeHostResponse>("/change-role", { id });
};

const roleService = {
  makeHost,
};

export default roleService;
