import { Category } from "@/types";
import axiosInstance from "../axiosInstance";

type CategoryResponse = {
  message: string;
  items: Category[];
};

export const getCategories = async () => {
  return await axiosInstance.get<CategoryResponse>("/category/all");
};

export const deleteCategory = async (id: string) => {
  return await axiosInstance.delete(`/category/${id}`);
};

export const createCategory = async (data: Category) => {
  return await axiosInstance.post("/category/create", data);
};

const categoryService = {
  getCategories,
  deleteCategory,
};

export default categoryService;
