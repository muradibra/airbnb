import { Category } from "@/types";
import axiosInstance from "../axiosInstance";

type CategoryResponse = {
  message: string;
  items: Category[];
};

export const getCategories = async () => {
  return await axiosInstance.get<CategoryResponse>("/category/all");
};

export const getCategoryById = async (id: string) => {
  return await axiosInstance.get(`/category/${id}`);
};

export const deleteCategory = async (id: string) => {
  return await axiosInstance.delete(`/category/${id}`);
};

export const createCategory = async (data: {
  name: string;
  description: string;
  icon: File | string;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.icon) {
    formData.append("icon", data.icon);
  }

  return await axiosInstance.post("/category/create", formData);
};

export const updateCategory = async (data: {
  id: string;
  name: string;
  description: string;
  icon: File | string;
}) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.icon) {
    formData.append("icon", data.icon);
  }

  return await axiosInstance.put(`/category/${data.id}`, formData);
};

const categoryService = {
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
  createCategory,
};

export default categoryService;
