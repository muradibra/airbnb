import { User } from "@/types";

export type GetAllUsers = {
  message: string;
  users: User[];
};

export type UpdateUser = {
  name: string;
  email: string;
  avatar: string;
};

export type UpdateUserPayload = {
  id: string;
  data: UpdateUser;
};
