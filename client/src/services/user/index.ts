import axiosInstance from "../axiosInstance";
import { GetAllUsers, UpdateUserPayload } from "./types";

export const getAllUsers = async () => {
  return axiosInstance.get<GetAllUsers>("/user/all");
};

export const deleteUser = async (id: string) => {
  return axiosInstance.delete(`/user/${id}`);
};

export const updateUser = async ({ id, data }: UpdateUserPayload) => {
  return axiosInstance.put(`/user/${id}`, data);
};

const userService = {
  getAllUsers,
  deleteUser,
  updateUser,
};

export default userService;
